// src/ChatWidget.tsx

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// Provides URL parsing capabilities similar to web browsers
import { URL } from 'react-native-url-polyfill';
// The core WebView component
import WebView, {
  type WebViewMessageEvent,
  type WebViewNavigation,
} from 'react-native-webview';
// Import types from the dedicated types file
import type {
  ChatMessagePayload,
  ChatWidgetProps,
  ErrorPayload,
} from './types';

// --- Constants ---
const ANIMATION_DURATION = 280;
const Z_INDEX = 2147483647; // Max z-index to stay on top
const DEFAULT_WEBVIEW_URL = 'https://cdn.infoset.app/chat/open_chat.html';
const DEFAULT_COLOR = '#FFFFFF';

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  // Props destructured with defaults
  isVisible = false,
  apiKey,
  iosKey,
  androidKey,
  webviewUrl = DEFAULT_WEBVIEW_URL,
  visitor,
  tags,
  color = DEFAULT_COLOR,
  statusBarTheme = 'auto',
  showLoadingIndicator = true,
  closeButtonBackgroundColor = 'rgba(0, 0, 0, 0.2)',
  closeButtonTextColor,
  onNewMessage,
  onRoomOpened,
  onRoomClosed,
  onRoomReopened,
  onWidgetWillShow,
  onWidgetShow,
  onWidgetWillHide,
  onWidgetHide,
  onError,
  handleUrl,
  onTranscriptReceived,
}) => {
  // --- Refs and State ---
  const webViewRef = useRef<WebView>(null);
  const screenHeight = Dimensions.get('screen').height;
  const animatedTopValue = useRef(new Animated.Value(screenHeight)).current; // Starts off-screen
  const [isMounted, setIsMounted] = useState(false); // Tracks if the component should render WebView
  const [isWebViewReady, setIsWebViewReady] = useState(false); // Tracks if the web app inside WebView sent 'uiReady'
  const [isAnimating, setIsAnimating] = useState(false); // Prevents overlapping animations

  // --- Derived Values ---
  // Determines if the background color is light or dark for theme adjustments
  const isColorLight = useMemo(() => {
    if (!color || color === 'transparent') return false;
    try {
      const hex = color.replace('#', '');
      if (hex.length !== 6) return false;
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.6;
    } catch {
      return false;
    }
  }, [color]);

  const effectiveStatusBarStyle = useMemo(() => {
    if (
      statusBarTheme === 'light-content' ||
      statusBarTheme === 'dark-content'
    ) {
      return statusBarTheme;
    }
    return isColorLight ? 'dark-content' : 'light-content';
  }, [statusBarTheme, isColorLight]);

  const effectiveCloseButtonTextColor = useMemo(() => {
    return closeButtonTextColor ?? (isColorLight ? '#000000' : '#FFFFFF');
  }, [closeButtonTextColor, isColorLight]);

  // --- Utility Functions ---
  // Reports errors via console and the onError prop
  const reportError = useCallback(
    (payload: ErrorPayload) => {
      console.error(
        `[ChatWidget] ${payload.code}: ${payload.message}`,
        payload.error || payload.data || ''
      );
      onError?.(payload);
    },
    [onError] // Depends only on the onError prop (should be memoized by parent)
  );

  // --- URL Construction ---
  // Constructs the final URL for the WebView, including necessary parameters
  const chatWidgetUrl = useMemo(() => {
    if (!apiKey) {
      console.warn('[ChatWidget] Missing apiKey prop.');
      reportError({ code: 'MISSING_PROPS', message: 'apiKey is required.' });
      return null;
    } else if (Platform.OS === 'ios' && !iosKey) {
      console.warn('[ChatWidget] Missing iosKey prop.');
      reportError({ code: 'MISSING_PROPS', message: 'iosKey is required.' });
      return null;
    } else if (Platform.OS === 'android' && !androidKey) {
      console.warn('[ChatWidget] Missing androidKey prop.');
      reportError({
        code: 'MISSING_PROPS',
        message: 'androidKey is required.',
      });
      return null;
    }
    try {
      const url = new URL(webviewUrl);
      const params = url.searchParams;
      params.set('platform', Platform.OS);
      params.set('apiKey', apiKey);
      // Add platform-specific keys if provided
      if (Platform.OS === 'ios' && iosKey) params.set('iosKey', iosKey);
      if (Platform.OS === 'android' && androidKey)
        params.set('androidKey', androidKey);
      // Add visitor data if provided (ensure web app expects stringified JSON)
      if (visitor) params.set('visitor', JSON.stringify(visitor));
      // Add tags if provided
      if (tags?.length) params.set('tags', tags.join(','));

      return url.toString();
    } catch (e) {
      reportError({
        code: 'INVALID_URL',
        message: `Invalid webviewUrl: ${webviewUrl}`,
        error: e,
      });
      return null;
    }
  }, [webviewUrl, apiKey, iosKey, androidKey, visitor, tags, reportError]); // Dependencies for URL construction

  // --- Effects ---

  // Effect 1: Manages mounting/unmounting based on critical props
  useEffect(() => {
    if (isVisible && apiKey && chatWidgetUrl) {
      if (!isMounted) {
        console.log('[ChatWidget] Mounting...');
        setIsMounted(true);
        setIsWebViewReady(false); // Reset ready state on mount
        animatedTopValue.setValue(screenHeight); // Ensure position is off-screen before first show
      }
    } else if (
      (!apiKey ||
        !chatWidgetUrl ||
        (!iosKey && Platform.OS === 'ios') ||
        (!androidKey && Platform.OS === 'android')) &&
      isMounted
    ) {
      // Unmount immediately if critical props become invalid while mounted
      reportError({
        code: 'MISSING_PROPS',
        message:
          'Required props (apiKey, iosKey, androidKey, or valid URL) became invalid.',
      });
      setIsMounted(false);
      animatedTopValue.setValue(screenHeight); // Ensure it's visually gone
    }
    // Visibility changes leading to hide animations are handled by Effect 2
  }, [
    isVisible,
    apiKey,
    iosKey,
    androidKey,
    chatWidgetUrl,
    isMounted,
    screenHeight,
    animatedTopValue,
    reportError,
  ]);

  // Effect 2: Manages show/hide animations based on isVisible and isMounted
  useEffect(() => {
    if (!isMounted) {
      animatedTopValue.setValue(screenHeight); // Ensure hidden if not mounted
      return;
    }

    const targetValue = isVisible ? 0 : screenHeight;
    const currentValue = (animatedTopValue as any)._value; // Access internal value (use cautiously)

    // Avoid starting animation if already animating or already at the target position
    if (isAnimating || currentValue === targetValue) {
      return;
    }

    // Determine lifecycle callbacks based on animation direction
    const onAnimationStartCallback = isVisible
      ? onWidgetWillShow
      : onWidgetWillHide;
    const onAnimationEndCallback = isVisible ? onWidgetShow : onWidgetHide;

    // Run pre-animation callback (handle potential promises)
    Promise.resolve(onAnimationStartCallback?.())
      .catch((e) => {
        reportError({
          code: 'CALLBACK_ERROR',
          message: `Error in ${isVisible ? 'onWidgetWillShow' : 'onWidgetWillHide'}`,
          error: e,
        });
      })
      .finally(() => {
        // Start the animation
        setIsAnimating(true);
        Animated.timing(animatedTopValue, {
          toValue: targetValue,
          duration: ANIMATION_DURATION,
          useNativeDriver: false, // Required for 'top' style animation
        }).start(({ finished }) => {
          setIsAnimating(false); // Mark animation as complete
          if (finished) {
            // Run post-animation callback
            try {
              onAnimationEndCallback?.();
            } catch (e) {
              reportError({
                code: 'CALLBACK_ERROR',
                message: `Error in ${isVisible ? 'onWidgetShow' : 'onWidgetHide'}`,
                error: e,
              });
            }
            // Component stays mounted even when hidden, unless unmounted by Effect 1 or parent removal
          }
        });
      });
  }, [
    isVisible,
    isMounted,
    animatedTopValue,
    isAnimating,
    onWidgetWillShow,
    onWidgetShow,
    onWidgetWillHide,
    onWidgetHide,
    reportError,
    screenHeight,
  ]);

  // --- WebView Event Handlers ---

  // Intercepts navigation requests within the WebView
  const handleShouldStartLoad = useCallback(
    (event: WebViewNavigation): boolean => {
      const { url } = event;
      // Allow loading the initial chat widget URL
      if (url === chatWidgetUrl || url === 'about:srcdoc') {
        return true;
      }
      // Handle external links
      console.log(`[ChatWidget] Intercepted navigation to: ${url}`);
      if (handleUrl) {
        // Use custom URL handler if provided
        handleUrl(url);
      } else {
        // Default behavior: Try opening the URL using Linking
        Linking.canOpenURL(url)
          .then((supported) => {
            if (supported) {
              Linking.openURL(url).catch((err) => {
                reportError({
                  code: 'URL_OPEN_ERROR',
                  message: `Failed to open URL: ${url}`,
                  error: err,
                });
              });
            } else {
              reportError({
                code: 'CANNOT_OPEN_URL',
                message: `Device cannot open URL: ${url}`,
              });
            }
          })
          .catch((err) => {
            reportError({
              code: 'URL_CHECK_ERROR',
              message: `Error checking if URL can be opened: ${url}`,
              error: err,
            });
          });
      }
      // Prevent the WebView from navigating to the external URL itself
      return false;
    },
    [chatWidgetUrl, handleUrl, reportError] // Dependencies for URL handling
  );

  // Handles messages sent from the WebView's JavaScript using window.ReactNativeWebView.postMessage
  const handleWebViewMessage = useCallback(
    (event: WebViewMessageEvent) => {
      let message: ChatMessagePayload | null = null;
      try {
        message = JSON.parse(event.nativeEvent.data);
        // Basic validation of message structure
        if (!message || typeof message.messageType !== 'string') {
          throw new Error('Invalid message format received.');
        }

        console.log(`[ChatWidget] Received message: ${message.messageType}`);

        // Process message based on its type
        switch (message.messageType) {
          case 'uiReady':
            setIsWebViewReady(true);
            // Optional: Send a confirmation back to the webview
            // postMessageToWebView({ messageType: 'sdkReady' });
            break;
          case 'newMessage':
            onNewMessage?.(message.data);
            break;
          case 'roomOpened':
            onRoomOpened?.(message.data);
            break;
          case 'roomClosed':
            onRoomClosed?.(message.data);
            break;
          case 'roomReopened':
            onRoomReopened?.(message.data);
            break;
          case 'hideChatWindow':
            // Request parent component to hide the widget by calling onWidgetHide
            // Parent should then set the `isVisible` prop to false.
            onWidgetHide?.();
            break;
          case 'error': // Error reported from within the web application
            reportError({
              code: 'WEBVIEW_APP_ERROR',
              message: 'Error reported by web application',
              data: message.data,
            });
            // Assume critical, unmount immediately and notify parent
            setIsMounted(false);
            animatedTopValue.setValue(screenHeight); // Ensure visually hidden
            onWidgetHide?.(); // Notify parent
            break;
          case 'onDownloadTranscript': // Handle received transcript data
            const transcript = message.data?.transcript;
            if (typeof transcript === 'string') {
              console.log('[ChatWidget] Received transcript data.');
              onTranscriptReceived?.(transcript); // Pass data to parent via callback
            } else {
              console.warn(
                '[ChatWidget] Invalid or missing transcript data received.'
              );
              reportError({
                code: 'INVALID_TRANSCRIPT_DATA',
                message:
                  'Invalid or missing transcript data received from webview',
              });
            }
            break;
          default:
            console.warn(
              `[ChatWidget] Received unknown messageType: ${message.messageType}`
            );
        }
      } catch (e) {
        reportError({
          code: 'INVALID_MESSAGE',
          message: 'Failed to parse message from WebView',
          data: event.nativeEvent.data,
          error: e,
        });
      }
    },
    // Dependencies for message handling. Relies on parent memoizing callbacks.
    [
      onNewMessage,
      onRoomOpened,
      onRoomClosed,
      onRoomReopened,
      onWidgetHide,
      reportError,
      animatedTopValue,
      screenHeight,
      onTranscriptReceived,
    ]
  );

  // --- WebView Methods ---
  // Utility function to send messages TO the WebView (not used internally by default)
  // const postMessageToWebView = useCallback(
  //   (message: object) => {
  //     if (webViewRef.current && isWebViewReady) {
  //       const jsonMessage = JSON.stringify(message);
  //       console.log(`[ChatWidget] Posting message: ${jsonMessage}`);
  //       webViewRef.current.postMessage(jsonMessage);
  //     } else {
  //       reportError({
  //         code: 'POST_MESSAGE_FAILED',
  //         message: 'Cannot post message: WebView not ready or ref unavailable.',
  //       });
  //     }
  //   },
  //   [isWebViewReady, reportError] // Depends on WebView readiness and error reporting
  // );

  // --- Render Logic ---
  // Do not render anything if component shouldn't be mounted (missing props, etc.)
  if (!isMounted || !chatWidgetUrl) {
    return null;
  }

  // Determine if the loading placeholder should be shown
  const showPlaceholder = isAnimating || !isWebViewReady;

  return (
    <Animated.View
      style={[
        styles.animatedViewBase,
        { top: animatedTopValue, zIndex: Z_INDEX },
      ]}
    >
      <StatusBar barStyle={effectiveStatusBarStyle} animated={true} />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: color }]}>
        {showPlaceholder && showLoadingIndicator && (
          <View style={[styles.loadingView, { backgroundColor: color }]}>
            <TouchableOpacity
              onPress={onWidgetHide} // Calls the prop provided by parent to hide
              style={[
                styles.closeBtn,
                { backgroundColor: closeButtonBackgroundColor },
              ]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Increase tappable area
            >
              <Text
                style={[
                  styles.closeBtnText,
                  { color: effectiveCloseButtonTextColor },
                ]}
              >
                ✕
              </Text>
            </TouchableOpacity>
            <ActivityIndicator
              size="large"
              color={isColorLight ? 'rgba(0,0,0,.5)' : '#FFFFFF'}
            />
          </View>
        )}

        <WebView
          ref={webViewRef}
          key={chatWidgetUrl} // Force remount if URL changes (use cautiously)
          style={[
            styles.webView,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              // Hide WebView visually until the web content signals it's ready
              opacity: isWebViewReady ? 1 : 0,
              // Ensure WebView background doesn't clash if loading view is transparent
              backgroundColor: 'transparent',
            },
          ]}
          source={{ uri: chatWidgetUrl }}
          // Security: Be more specific if possible, e.g., ['https://*.infoset.app']
          originWhitelist={['*']}
          // Core settings
          javaScriptEnabled={true}
          domStorageEnabled={true} // Often needed for web apps authentication/state
          cacheEnabled={false} // Disable cache if content should always be fresh
          // Video playback
          allowsFullscreenVideo={true}
          // Gestures (usually disabled for embedded widgets)
          allowsBackForwardNavigationGestures={false}
          allowsLinkPreview={false} // iOS link preview on long press
          // Event Handlers
          onMessage={handleWebViewMessage}
          onShouldStartLoadWithRequest={handleShouldStartLoad}
          // WebView Load/Error Callbacks
          onLoadEnd={() => console.log('[ChatWidget] WebView onLoadEnd')}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            // Handle WebView specific load errors (network, certificate, etc.)
            reportError({
              code: 'WEBVIEW_LOAD_ERROR',
              message: `WebView load failed: ${nativeEvent.description || 'Unknown Error'}`,
              data: nativeEvent,
            });
          }}
          // Use custom loading indicator, disable WebView's default
          startInLoadingState={false}
          // Hide default indicator while loading html, show custom one until 'uiReady'
          // renderLoading={() => null}
        />
      </SafeAreaView>
    </Animated.View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  animatedViewBase: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  safeArea: {
    flex: 1,
    overflow: 'hidden',
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingView: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  closeBtn: {
    position: 'absolute',
    top: Platform.select({ ios: 50, default: 20 }),
    right: 15,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  closeBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 22,
  },
});
