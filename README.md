[![npm version](https://badge.fury.io/js/%40infoset%2Freact-native.svg)](https://badge.fury.io/js/%40infoset%2Freact-native)
![GitHub](https://img.shields.io/github/license/infoset/infoset-react-native)

<img src="https://user-images.githubusercontent.com/13895224/94475996-8de39c80-01d8-11eb-8771-e590b33c612e.png" alt="Infoset" width="300" />

# @infoset/react-native

Infoset react-native SDK allows you to integrate Infoset Chat with your react-native app.

## Setup

This library is available on npm, install it with: `npm i @infoset/react-native` or `yarn add @infoset/react-native`.

### Peer Dependecies

1. react-native-webview
2. react-native-url-polyfill

### Usage

1.  Import @infoset/react-native:

```javascript
import { ChatWidget } from '@infoset/react-native';
```

2.  Then simply mount the component and set `isVisible` to `true` to display the chat window:

```javascript
function ExampleComponent() {
  return (
    <ChatWidget
      isVisible={true}
      apiKey="your_chat_widget_api_key"
      iosKey="your_chat_widget_ios_key"
      androidKey="your_chat_widget_android_key"
      ...
    />
  )
}
```

Chat widget will be displayed when `isVisible` is `true`.
You can get your `apiKey`, `iosKey` and `androidKey` from the Infoset dashboard. `apiKey` is required, and at least one of `iosKey` or `androidKey` is required.

### Assign chats to tags

You can route your chats to specific tags by providing `tags`.

```javascript
<ChatWidget
  ...
  tags={['Support', 'Recurring Customer']}
/>
```

### Setting User Variables

You can provide your user's details such as name and email if they are known, so you will immediately know who you are talking to on the Infoset dashboard:

```javascript
<ChatWidget
  ...
  visitor={{
    id: 123,
    email: 'example@infoset.app',
    firstName: 'John',
    lastName: 'Doe',
    ...
  }}
/>
```

See `examples/src/app.tsx` for all of the visitor fields.

### Handling URLs

By default, all links in chat messages are opened in default browser. To change this behavior you can use the `handleUrl` to handle URLs yourself.

```javascript
<ChatWidget
  ...
  handleUrl={(url) => console.log(`URL is ${url}`}
/>
```

See example app from `/examples` for complete example.

### Available props

-- Widget
| Name | Type | Default |Description |
| ------------------------------ | ---------------- | ------------------------------ | -------------------------------------------------------------- |
| isVisible | bool | **REQUIRED** / false | Show / hide the widget |
| apiKey | string | **REQUIRED** | Infoset API key |
| iosKey | string | undefined | IOS key given from Infoset |
| androidKey | string | undefined | Android key given from Infoset |
| color | string | '#fff' | Widget color for background of `SafeAreaView` |
| onWidgetWillShow | func | () => void | Called before the widget show animation begins |
| onWidgetShow | func | () => void | Called when the widget is completely visible |
| onWidgetWillHide | func | () => void | Called before the widget hide animation begins |
| onWidgetHide | func | () => void | Called when the widget is completely hiden |
| onNewMessage | func | (payload: { author: Author, message: string, messageId: string}) => void | Called when the new message received |
| onRoomOpened | func | (payload: { roomId: number }) => void | Called when the room opened |
| onRoomClosed | func | (payload: { roomId: number }) => void | Called when the room closed |
| onRoomReopened | func | (payload: { roomId: number }) => void | Called when the room reopened |
| handleUrl | func | (url: string) => void | Called when a link is clicked |
| visitor | object | undefined | Visitor data |
| tags | array | undefined | Tags |
