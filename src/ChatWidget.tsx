/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { URL } from 'react-native-url-polyfill';
import WebView, {
  WebViewMessageEvent,
  WebViewNavigation,
} from 'react-native-webview';
import type { ChatMessageTypes, ChatWidgetProps } from './types';

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  isVisible = false,
  apiKey,
  iosKey,
  androidKey,
  color = '#fff',
  onNewMessage,
  onRoomOpened,
  onRoomClosed,
  onRoomReopened,
  onWidgetWillShow,
  onWidgetShow,
  onWidgetWillHide,
  onWidgetHide,
  handleUrl,
  visitor,
  tags,
}) => {
  const screenHeight = Dimensions.get('screen').height;
  const webViewRef = useRef<WebView>(null);
  const [initiated, setInitiated] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const [isUIReady, setIsUIReady] = useState<boolean>(false);
  const animatedTopValue = useRef(new Animated.Value(0)).current;

  const widgetWillShow = useCallback(
    () =>
      new Promise((resolve) => {
        setIsHidden(false);
        return resolve(onWidgetWillShow?.());
      }),
    [onWidgetWillShow]
  );
  const widgetWillHide = useCallback(
    () => new Promise((resolve) => resolve(onWidgetWillHide?.())),
    [onWidgetWillHide]
  );
  const onShow = useCallback(() => {
    onWidgetShow?.();
  }, [onWidgetShow]);

  const onHide = useCallback(() => {
    onWidgetHide?.();
    setIsHidden(true);
  }, [onWidgetHide]);

  const showWidget = useCallback(() => {
    widgetWillShow?.().then(() => {
      Animated.parallel([
        Animated.timing(animatedTopValue, {
          toValue: 0,
          duration: 280,
          useNativeDriver: false,
        }),
      ]).start((result) => {
        if (result.finished) {
          onShow();
        }
      });
    });
  }, [animatedTopValue, widgetWillShow, onShow]);

  const hideWidget = useCallback(() => {
    widgetWillHide().then(() => {
      Animated.parallel([
        Animated.timing(animatedTopValue, {
          toValue: screenHeight,
          duration: 280,
          useNativeDriver: false,
        }),
      ]).start((result) => {
        if (result.finished) {
          onHide();
        }
      });
    });
  }, [animatedTopValue, widgetWillHide, onHide, screenHeight]);

  useEffect(() => {
    if (isVisible) {
      if (!initiated) {
        setInitiated(true);
      }
    }
  }, [isVisible, initiated]);

  useEffect(() => {
    if (isVisible) {
      showWidget();
    } else {
      hideWidget();
    }
  }, [
    isVisible,
    animatedTopValue,
    screenHeight,
    onWidgetHide,
    onWidgetShow,
    hideWidget,
    showWidget,
    onShow,
    onHide,
    widgetWillShow,
    widgetWillHide,
  ]);

  if (
    (!(iosKey && iosKey !== '') && !(androidKey && androidKey !== '')) ||
    !(apiKey && apiKey !== '')
  ) {
    return null;
  }

  if (!initiated) {
    return null;
  }

  // build url
  let chatURL = new URL('https://cdn.infoset.app/chat/open_chat.html');
  const appendQueryParam = (key: string, value: any) => {
    if (typeof value === 'object') {
      Object.entries(value).forEach(([nestedKey, nestedVal]) => {
        if (typeof nestedVal === 'object') {
          appendQueryParam(`${key}[${nestedKey}]`, nestedVal);
          return;
        }
        chatURL.searchParams.append(`${key}[${nestedKey}]`, nestedVal as any);
      });
      return;
    }
    chatURL.searchParams.append(key, value);
  };

  appendQueryParam('platform', Platform.OS);
  appendQueryParam('apiKey', apiKey);

  // append os key
  if (iosKey) {
    appendQueryParam('iosKey', iosKey);
  }

  if (androidKey) {
    appendQueryParam('androidKey', androidKey);
  }

  // append visitor
  if (visitor && typeof visitor === 'object') {
    appendQueryParam('visitor', visitor);
  }

  // append tags
  if (Array.isArray(tags) && tags.length) {
    appendQueryParam('tags', tags.join(','));
  }

  const onShouldStartLoadWithRequest = (event: WebViewNavigation) => {
    const { url } = event;
    if ([chatURL.toString(), 'about:srcdoc'].includes(url)) return true;

    if (handleUrl) {
      handleUrl(url);
    } else {
      Linking.openURL(url);
    }
    return false;
  };
  function onCaptureWebViewEvent(event: WebViewMessageEvent) {
    const {
      messageType,
      data,
    }: {
      messageType: ChatMessageTypes;
      data: any;
    } = JSON.parse(event.nativeEvent.data);

    if (messageType) {
      if (messageType === 'uiReady') {
        setIsUIReady(true);
      } else if (messageType === 'newMessage') {
        onNewMessage?.(data);
      } else if (messageType === 'roomOpened') {
        onRoomOpened?.(data);
      } else if (messageType === 'roomClosed') {
        onRoomClosed?.(data);
      } else if (messageType === 'roomReopened') {
        onRoomReopened?.(data);
      } else if (messageType === 'hideChatWindow') {
        widgetWillHide().then(() => {
          hideWidget();
        });
      } else if (messageType === 'error') {
        console.warn('Error. Chat Widget closing..');
        widgetWillHide().then(() => {
          hideWidget();
          setInitiated(false);
        });
      }
    }
  }

  let isColorLightish = true;
  if (color) {
    if (
      (color.startsWith('#') && !color.includes('#f')) ||
      color.replace(/' '/g, '').includes('255,255,255')
    ) {
      isColorLightish = false;
    }
  }

  return (
    <Animated.View
      style={[
        styles.animatedViewBase,
        {
          top: animatedTopValue,
        },
      ]}
    >
      <StatusBar
        barStyle={!isColorLightish ? 'light-content' : 'dark-content'}
      />
      <SafeAreaView
        style={[
          styles.flexContainer,
          {
            paddingVertical: 20,
            backgroundColor: color || '#fff',
          },
        ]}
      >
        {!isUIReady && !isHidden && (
          <View style={[styles.loadingView, { backgroundColor: color }]}>
            <TouchableOpacity
              onPress={() => onWidgetHide?.()}
              style={[
                styles.closeBtn,
                {
                  backgroundColor: 'rgba(0, 0, 0, .2)',
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: isColorLightish ? '#000' : '#fff',
                }}
              >
                X
              </Text>
            </TouchableOpacity>
            <ActivityIndicator
              size="large"
              color={isColorLightish ? 'rgba(0,0,0,.4)' : '#fff'}
            />
          </View>
        )}
        <WebView
          ref={webViewRef}
          renderLoading={() => (
            <ActivityIndicator
              color={isColorLightish ? 'rgba(0,0,0,.4)' : '#fff'}
              size="large"
              style={[
                styles.webViewIndicator,
                { backgroundColor: color || '#fff' },
              ]}
            />
          )}
          style={styles.flexContainer}
          source={{ uri: chatURL.toString() }}
          startInLoadingState
          javaScriptEnabled
          allowFileAccess
          allowsBackForwardNavigationGestures
          allowsLinkPreview
          allowFileAccessFromFileURLs
          allowsFullscreenVideo
          cacheEnabled={false}
          originWhitelist={['*']}
          onMessage={onCaptureWebViewEvent}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        />
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  animatedViewBase: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 2147483647,
  },
  webViewIndicator: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
  loadingView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  closeBtn: {
    position: 'absolute',
    top: 76,
    right: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    zIndex: 2,
  },
});
