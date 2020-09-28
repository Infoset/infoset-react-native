/* eslint-disable react-native/no-inline-styles */
import {
  ChatWidget,
  VisitorType,
  // ChatWidgetProps,
} from '@infoset/react-native';
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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
    <SafeAreaView style={{ flex: 1 }}>
      <ChatWidget
        isVisible={visible}
        apiKey="123-456-789" // your infoset API key
        iosKey="123-456-789" // ios key given from infoset
        androidKey="123-456-789" // ios key given from infoset
        color="#4c65ff"
        onWidgetHide={() => setVisible(false)}
        onWidgetWillHide={() => console.log('will hide')}
        onWidgetWillShow={() => console.log('will show')}
        onWidgetShow={() => console.log('on show')}
        onNewMessage={() => console.log('on new message')}
        handleUrl={(url) => console.log(url)}
        visitor={visitor}
        tags={['Support', 'Recurring Customer']}
      />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.showWidgetBtn}
          onPress={() => setVisible(true)}
        >
          <Text style={{ fontSize: 24 }}>Show Chat Widget</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
