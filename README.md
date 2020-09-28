# @infoset/react-native

Infoset react-native SDK allows you to integrate Infoset Chat with your react-native app.

## Setup

This library is available on npm, install it with: `npm i react-native-modal react-native-webview@8.0.0` or `yarn add react-native-modal react-native-webview@8.0.0`.

## Usage
1.  Import @infoset/react-native:

```javascript
import InfosetSDK from '@infoset/react-native';
// import { Widget } from '@infoset/react-native';
```

2.  Simply

```javascript
function ExampleComponent() {
  return (
    <InfosetSDK.Widget
      isVisible={false}
      apiKey="....." // your infoset API key
      iosKey="....." // ios key given from infoset
      androidKey="....." // android key given from infoset
    />
  )
}
```

3.  Then simply show it by setting the `isVisible` prop to true:

```javascript
function ExampleComponent() {
  return (
    <InfosetSDK.Widget
      isVisible={true}
      apiKey="....." // your infoset API key
      iosKey="....." // ios key given from infoset
      androidKey="....." // android key given from infoset
    />
  )
}
```

The `isVisible` prop is the only prop you'll really need to make the modal work: you should control this prop value by saving it in your state and setting it to `true` or `false` when needed.
`apiKey` is required.
At least one of `iosKey` or `androidKey` is required. You are free to enter both of them also. Otherwise, widget will not work.

## A complete example
```javascript
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import InfosetSDK from '@infoset/react-native';
// import { Widget, WidgetProps } from '@infoset/react-native'

const ExampleApp: React.FC<{}> = () => {
    const [visible, setVisible] = useState<boolean>(false);

    const onShowChat = () => {
        setVisible(true);
    }

    return (
        <>
            <InfosetSDK.Widget
                apiKey="....." // your infoset API key
                iosKey="....." // ios key given from infoset
                androidKey="....." // android key given from infoset
                isVisible={visible}
                onWidgetHide={() => setVisible(false)}
             />
             <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
             }}>
                <TouchableOpacity
                    style={{
                        borderWidth: 1,
                        borderColor: 'gray',
                        borderRadius: 6,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                    }}
                    onPress={onShowChat}
                >
                  <Text style={{ fontSize: 24 }}>Show Chat</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}
```

## Available props
-- Widget
| Name                           | Type             | Default                        |Description                                                     |
| ------------------------------ | ---------------- | ------------------------------ | -------------------------------------------------------------- |
| isVisible                      | bool             | **REQUIRED**                   | Show / hide the widget                                         |
| enableOpenLinksWithBrowser     | bool             | true                           | Open links with default browser                                |
| apiKey                         | string           | **REQUIRED**                   | Infoset API key                                                |
| color                          | string           | '#fff'                         | Widget color                                                   |
| iosKey                         | string           | undefined                      | IOS key given from Infoset                                     |
| androidKey                     | string           | undefined                      | Android key given from Infoset                                 |
| onWidgetWillShow               | func             | () => void                     | Called before the widget show animation begins                 |
| onWidgetShow                   | func             | () => void                     | Called when the widget is completely visible                   |
| onWidgetWillHide               | func             | () => void                     | Called before the widget hide animation begins                 |
| onWidgetHide                   | func             | () => void                     | Called when the widget is completely hiden                     |
| onNewMessage                   | func             | () => void                     | Called when the new message received                           |
| getLink                        | func             | (url: string) => void          | Called when a link clicked                                     |
| visitor                        | object           | undefined                      | Visitor data                                                   |
