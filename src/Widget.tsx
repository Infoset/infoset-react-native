import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { URL } from 'react-native-url-polyfill';
import WebView, {
  WebViewMessageEvent,
  WebViewNavigation,
} from 'react-native-webview';
import type { MessageTypes, WidgetProps } from './types';

export const Widget: React.FC<WidgetProps> = ({
  apiKey,
  iosKey,
  color,
  androidKey,
  onNewMessage,
  isVisible,
  onWidgetWillShow,
  onWidgetShow,
  onWidgetWillHide,
  onWidgetHide,
  visitor,
}) => {
  const screenHeight = Dimensions.get('screen').height;
  const webViewRef = useRef<WebView>(null);
  const [initiated, setInitiated] = useState<boolean>(false);
  const animatedTopValue = useRef(new Animated.Value(0)).current;
  const aniamtedOpacity = useRef(new Animated.Value(0)).current;

  function onCaptureWebViewEvent(event: WebViewMessageEvent) {
    const {
      messageType,
    }: {
      messageType: MessageTypes;
    } = JSON.parse(event.nativeEvent.data);
    if (messageType) {
      if (messageType === 'uiReady') {
        Alert.alert('UI READY MF');
      } else if (messageType === 'newMessage') {
        onNewMessage?.();
      } else if (messageType === 'hideChatWindow') {
        hideWidget();
      }
    }
  }

  useEffect(() => {
    if (isVisible) {
      if (!initiated) {
        setInitiated(true);
      }
    }
  }, [isVisible, initiated]);

  const showWidget = useCallback(() => {
    Animated.parallel([
      Animated.timing(animatedTopValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(aniamtedOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start((result) => {
      if (result.finished) {
        onWidgetShow?.();
      }
    });
  }, [animatedTopValue, aniamtedOpacity, onWidgetShow]);

  const hideWidget = useCallback(() => {
    Animated.parallel([
      Animated.timing(animatedTopValue, {
        toValue: screenHeight,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(aniamtedOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start((result) => {
      if (result.finished) {
        onWidgetHide?.();
      }
    });
  }, [animatedTopValue, aniamtedOpacity, onWidgetHide, screenHeight]);

  useEffect(() => {
    if (isVisible) {
      onWidgetWillShow?.();
      showWidget();
    } else {
      onWidgetWillHide?.();
      hideWidget();
    }
  }, [
    isVisible,
    animatedTopValue,
    aniamtedOpacity,
    screenHeight,
    onWidgetWillHide,
    onWidgetHide,
    onWidgetWillShow,
    onWidgetShow,
    hideWidget,
    showWidget,
  ]);

  if ((!iosKey && !androidKey) || !apiKey) {
    return null;
  }

  if (!initiated) {
    return null;
  }

  // build url
  let chatURL = new URL('https://cdn.infoset.app/chat/open_chat.html');
  chatURL.searchParams.append('platform', Platform.OS);
  chatURL.searchParams.append('apiKey', apiKey);

  // append os key
  if (iosKey) {
    chatURL.searchParams.append('iosKey', iosKey);
  } else if (androidKey) {
    chatURL.searchParams.append('androidKey', androidKey);
  }

  // append visitor
  if (visitor?.id) {
    Object.entries(visitor).forEach(
      (entry) => entry[1] && chatURL.searchParams.append(entry[0], entry[1])
    );
  }

  const onNavigationStateChange = (navState: WebViewNavigation) => {
    if (navState.url !== chatURL.toString()) {
      webViewRef.current?.stopLoading();
      // TODO
      // Linking.openURL(navState.url);
    }
  };

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
          opacity: aniamtedOpacity,
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
            backgroundColor: color || '#fff',
          },
        ]}
      >
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
          onMessage={onCaptureWebViewEvent}
          onNavigationStateChange={onNavigationStateChange}
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
    zIndex: 9999999999,
  },
  webViewIndicator: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
});
