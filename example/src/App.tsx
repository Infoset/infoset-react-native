/* eslint-disable react-native/no-inline-styles */
import InfosetSDK from 'infoset-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { Widget, WidgetProps } from 'infoset-react-native';

const App: React.FC<{}> = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <InfosetSDK.Widget
        isVisible={visible}
        enableOpenLinksWithBrowser={false}
        apiKey="..." // your infoset API key
        iosKey="..." // ios key given from infoset
        color="#4c65ff"
        onWidgetHide={() => setVisible(false)}
        onWidgetWillHide={() => console.log('will hide')}
        onWidgetWillShow={() => console.log('will show')}
        onWidgetShow={() => console.log('on show')}
        getLink={(url) => console.log(url)}
        visitor={{
          id: '123',
          firstName: 'test',
        }}
      />
      <View style={styles.container}>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 6,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
          onPress={() => setVisible(true)}
        >
          <Text style={{ fontSize: 24 }}>Show Chat</Text>
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
});

export default App;
