/* eslint-disable react-native/no-inline-styles */
import {
  ChatWidget,
  VisitorType,
  // ChatWidgetProps,
} from '@infoset/react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const App: React.FC<{}> = () => {
  const [visible, setVisible] = useState(false);

  const visitor: VisitorType = {
    id: 123,
    firstName: 'John',
    lastName: 'Wick',
    company: 'infoset',
    email: 'example@infoset.app',
    phone: '+901234567890',
    photoUrl: '',
    createdAt: '',
    userHash: '',
  };

  return (
    <>
      <ChatWidget
        isVisible={visible}
        apiKey="w118TxtMgkacPmlEctTdRxxbZV7XcYLKTy6egVmv"
        iosKey="hu7AgY6JtnPl0iRGiHUIBwGNZrWHnxll"
        androidKey="YUnmeSR9O0HBoZYAWWMxkAxKVXZCBuWS"
        color="#E69618"
        onWidgetHide={() => setVisible(false)}
        onWidgetWillHide={() => console.log('will hide')}
        onWidgetWillShow={() => console.log('will show')}
        onWidgetShow={() => console.log('on show')}
        onNewMessage={() => console.log('on new message')}
        onRoomOpened={() => console.log('on room opened')}
        onRoomReopened={() => console.log('on room reopened')}
        onRoomClosed={() => console.log('on room closed')}
        handleUrl={(url) => console.log(url)}
        visitor={visitor}
        tags={['Support', 'Recurring Customer']}
      />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.showWidgetBtn}
          onPress={() => setVisible(true)}
        >
          <Text style={{ fontSize: 24 }}>Show Chat Widgetx</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showWidgetBtn: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
});

export default App;
