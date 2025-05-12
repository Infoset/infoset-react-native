// PlainExample/App.tsx

import {
  ChatWidget,
  type ErrorPayload,
  type VisitorType,
} from '@infoset/react-native';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Uncomment if implementing saving/sharing in Expo example
// import * as FileSystem from 'expo-file-system';
// import { shareAsync } from 'expo-sharing';

const App: React.FC<{}> = () => {
  const [visible, setVisible] = useState(false);

  // Example visitor data
  const visitor: VisitorType = {
    id: 'user-123-xyz', // Use string IDs if possible
    firstName: 'John',
    lastName: 'Wick',
    company: 'Example Inc.',
    email: 'john.wick@example.com',
    phone: '+15551234567',
    // Add custom fields if needed
    // customFields: { membership: 'Gold', lastOrder: '...' }
  };

  // --- Memoized Callbacks for ChatWidget Props ---
  const handleWidgetHide = useCallback(() => {
    console.log('[[App: onWidgetHide]] Setting visibility to false');
    setVisible(false);
  }, []); // Empty dependency array as setVisible is stable

  const handleWidgetWillHide = useCallback(() => {
    console.log('[[App: onWidgetWillHide]]');
  }, []);

  const handleWidgetWillShow = useCallback(() => {
    console.log('[[App: onWidgetWillShow]]');
  }, []);

  const handleWidgetShow = useCallback(() => {
    console.log('[[App: onWidgetShow]]');
  }, []);

  const handleNewMessage = useCallback(
    (data: { author: any; message: string; messageId: string }) => {
      console.log(`[[App: onNewMessage]]: ${JSON.stringify(data)}`);
    },
    []
  );

  const handleRoomOpened = useCallback((data: { roomId: number }) => {
    console.log(`[[App: onRoomOpened]]: ${JSON.stringify(data)}`);
  }, []);

  const handleRoomReopened = useCallback((data: { roomId: number }) => {
    console.log(`[[App: onRoomReopened]]: ${JSON.stringify(data)}`);
  }, []);

  const handleRoomClosed = useCallback((data: { roomId: number }) => {
    console.log(`[[App: onRoomClosed]]: ${JSON.stringify(data)}`);
  }, []);

  const handleError = useCallback((error: ErrorPayload) => {
    console.error(
      `[[App: onError]]: Code: ${error.code}, Message: ${error.message}`,
      error.error || error.data
    );
    Alert.alert('Chat Error', `Code: ${error.code}\nMessage: ${error.message}`);
  }, []);

  const handleUrl = useCallback((url: string) => {
    console.log(`[[App: handleUrl]]: Intercepted URL: ${url}`);
    // Example: Open specific URLs differently or show confirmation
    // if (url.includes('special-link')) { /* handle differently */ }
    // else { Linking.openURL(url); }
    Alert.alert('Handle URL', `Chat tried to open: ${url}`);
  }, []);

  // Callback to handle received transcript data
  const handleTranscriptReceived = useCallback(async (transcript: string) => {
    console.log(
      '[[App: onTranscriptReceived]]: Received transcript data (first 100 chars):',
      transcript.substring(0, 100) + '...'
    );
    Alert.alert(
      'Transcript Received!',
      'Transcript data arrived in App.tsx. See console log. Implement saving/sharing logic here using appropriate file system/sharing APIs for your target platform (Expo/RN CLI).',
      [{ text: 'OK' }]
    );

    // --- IMPLEMENT SAVING/SHARING HERE ---
    // Example using console.log, replace with actual implementation
    // if (Platform.OS === 'web') { console.log("Save/Share not implemented for web example"); }
    // else { /* Use expo-file-system or react-native-fs + Share */ }
  }, []);
  // --- End Callbacks ---

  return (
    <SafeAreaView style={styles.container}>
      {/* The Chat Widget Component */}
      <ChatWidget
        // --- Core Props ---
        isVisible={visible}
        apiKey="YOUR_API_KEY" // Replace with your actual API Key
        iosKey="YOUR_IOS_KEY" // Replace with your actual iOS Key
        androidKey="YOUR_ANDROID_KEY" // Replace with your actual Android Key
        visitor={visitor}
        tags={['Support', 'Recurring Customer']}
        // webviewUrl="YOUR_CUSTOM_CHAT_URL" // Optional: Override default URL

        // --- Customization ---
        color="#E69618" // Example background color
        // --- Callbacks ---
        onWidgetHide={handleWidgetHide}
        onWidgetWillHide={handleWidgetWillHide}
        onWidgetWillShow={handleWidgetWillShow}
        onWidgetShow={handleWidgetShow}
        onNewMessage={handleNewMessage}
        onRoomOpened={handleRoomOpened}
        onRoomReopened={handleRoomReopened}
        onRoomClosed={handleRoomClosed}
        onError={handleError}
        handleUrl={handleUrl}
        onTranscriptReceived={handleTranscriptReceived}
      />

      {/* Button to open the chat widget */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.showWidgetBtn}
          onPress={() => {
            console.log('[[App]] Show Chat Widget button pressed');
            setVisible(true);
          }}
        >
          <Text style={styles.buttonText}>Show Chat Widget</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // A light background for the main screen
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  showWidgetBtn: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '500',
  },
});

export default App;
