[![npm version](https://badge.fury.io/js/%40infoset%2Freact-native.svg)](https://badge.fury.io/js/%40infoset%2Freact-native)
![GitHub](https://img.shields.io/github/license/infoset/infoset-react-native)
![Downloads](https://img.shields.io/npm/dm/%40infoset%2Freact-native.svg)

<p align="center">
  <img src="https://user-images.githubusercontent.com/13895224/94475996-8de39c80-01d8-11eb-8771-e590b33c612e.png" alt="Infoset" width="250" />
</p>

# @infoset/react-native

The official Infoset React Native SDK allows you to seamlessly integrate the Infoset Live Chat widget into your React Native applications. Engage with your users directly within your mobile app.

## Features

- Display Infoset live chat within a WebView.
- Pass visitor information and tags.
- Customize widget appearance (background color, status bar).
- Handle new messages, room events, and errors via callbacks.
- Intercept and handle URL clicks from chat messages.
- Receive chat transcript data to handle saving/sharing within your app.
- Compatible with plain React Native CLI projects and Expo (including Expo Go).

## Installation

Install the library using npm or yarn:

```bash
npm install @infoset/react-native
# or
yarn add @infoset/react-native
```

### Peer Dependencies

This library relies on certain peer dependencies that you need to install and link in your project:

1.  **`react`**: (Your project should already have this)
2.  **`react-native`**: (Your project should already have this)
3.  **`react-native-webview`**: Provides the WebView component.
    ```bash
    yarn add react-native-webview
    # or
    npm install react-native-webview
    ```
4.  **`react-native-url-polyfill`**: Provides URL parsing capabilities.
    ```bash
    yarn add react-native-url-polyfill
    # or
    npm install react-native-url-polyfill
    ```

### iOS Specific Setup

After installing the dependencies, for iOS, navigate to your `ios` directory and run `pod install`:

```bash
cd ios
pod install
# or for React Native CLI projects: npx pod-install
```

### Expo Go Compatibility

Good news! This library is compatible with **Expo Go**. Since it only relies on `react-native-webview` (which is included in Expo Go) and `react-native-url-polyfill` (a JavaScript-only polyfill), you can use it in projects running on Expo Go without needing a development build for basic functionality.

## Usage

### 1. Import the ChatWidget

```javascript
import { ChatWidget } from '@infoset/react-native';
// You can also import types if needed:
// import { ChatWidget, type VisitorType, type ErrorPayload } from '@infoset/react-native';
```

### 2. Mount the Component

Mount the `ChatWidget` component in your app and control its visibility using the `isVisible` prop.

```javascript
import React, { useState, useCallback } from 'react';
import { View, Button, Linking, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { ChatWidget, type VisitorType, type ErrorPayload } from '@infoset/react-native'; // Adjust if your lib name is different

// Replace 'your-library-name' with the actual name of your library package, e.g., '@infoset/react-native'

function MyChatScreen() {
  const [isChatVisible, setIsChatVisible] = useState(false);

  const visitorData: VisitorType = {
    id: 'user123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  };

  const handleTranscript = useCallback((transcript: string) => {
    console.log('Chat Transcript Received (first 100 chars):', transcript.substring(0, 100) + '...');
    // In a real app, you would implement logic to save or share the transcript
    // e.g., using expo-file-system, react-native-fs (if not Expo Go), or Share API
    Alert.alert('Transcript Received!', 'Check console for details.');
  }, []);

  const handleError = useCallback((error: ErrorPayload) => {
    console.error('[App] ChatWidget Error:', `Code: ${error.code}, Message: ${error.message}`, error.data || error.error);
    // Optionally inform the user, especially for critical errors
    // Alert.alert("Chat Error", `An error occurred: ${error.message}`);
  }, []);

  const handleLinkPress = useCallback((url: string) => {
    console.log('[App] Link clicked in chat:', url);
    // Decide how to handle the URL. For example, open all external links in a browser.
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
        Alert.alert("Cannot Open Link", "This link cannot be opened.");
      }
    }).catch(err => console.error("Error opening URL", err));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title={isChatVisible ? "Hide Chat" : "Show Chat"}
          onPress={() => setIsChatVisible(!isChatVisible)}
        />
      </View>

      <ChatWidget
        isVisible={isChatVisible}
        apiKey="YOUR_API_KEY"       // Replace with your Infoset API Key
        iosKey="YOUR_IOS_KEY"       // Replace with your Infoset iOS Key
        androidKey="YOUR_ANDROID_KEY" // Replace with your Infoset Android Key
        // webviewUrl="YOUR_CUSTOM_CHAT_URL" // Optional: Defaults to Infoset CDN

        visitor={visitorData}
        tags={['Support', 'MobileAppUser']}

        color="#F5F5F5" // Optional: background color of the widget area
        statusBarTheme="dark-content" // Optional: 'auto', 'light-content', or 'dark-content'

        onWidgetHide={() => {
          console.log('[App] ChatWidget hidden, setting isVisible to false');
          setIsChatVisible(false); // Essential to update your state
        }}
        onNewMessage={(data) => console.log('[App] New message:', data.message)}
        onTranscriptReceived={handleTranscript}
        onError={handleError}
        handleUrl={handleLinkPress} // Example of handling URLs

        // Add other lifecycle/event callbacks as needed
        // onWidgetWillShow={() => console.log('[App] Chat will show')}
        // onWidgetShow={() => console.log('[App] Chat shown')}
        // onWidgetWillHide={() => console.log('[App] Chat will hide')}
        // onRoomOpened={(data) => console.log('[App] Room opened:', data.roomId)}
        // onRoomClosed={(data) => console.log('[App] Room closed:', data.roomId)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    padding: 10,
    alignItems: 'center',
  }
});

export default MyChatScreen;
```

**Important:**

- You must provide your `apiKey`.
- You should provide either `iosKey` or `androidKey` (or both) depending on the platforms you target. These keys are obtained from your Infoset dashboard.
- The `onWidgetHide` callback should typically be used to set your local state variable (which controls the `isVisible` prop) to `false`.

### Setting Visitor Information

Provide user details via the `visitor` prop. This helps identify the user on the Infoset dashboard.

```javascript
<ChatWidget
  // ... other props
  visitor={{
    id: 'user-unique-id-456', // Can be string or number
    email: 'jane.doe@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
    phone: '+15559876543',
    company: 'Acme Corp',
    // You can add any custom fields your backend supports
    customFields: {
      plan: 'Premium',
      userId: 12345,
    },
  }}
/>
```

Refer to the `VisitorType` in your type definitions (e.g., `src/types.ts` or the library's exported types) for all available fields.

### Assigning Chats to Tags

Route chats to specific agent groups or categories using the `tags` prop.

```javascript
<ChatWidget
  // ... other props
  tags={['SalesInquiry', 'VIP_Customer']}
/>
```

### Custom URL Handling

By default, links clicked within the chat messages are opened using `Linking.openURL`. You can override this behavior with the `handleUrl` prop.

```javascript
<ChatWidget
  // ... other props
  handleUrl={(url) => {
    if (url.includes('myinternalapplink://')) {
      // Handle internal app navigation
      console.log('Handling internal link:', url);
      // myAppNavigation.navigate(url);
    } else {
      // Open external links in a browser or InAppBrowser
      Linking.openURL(url);
    }
  }}
/>
```

### Receiving Chat Transcript Data

When the chat transcript is available (e.g., user requests a download from within the web widget), the `onTranscriptReceived` callback is triggered with the transcript content as a string. Your application is responsible for handling this string (e.g., saving it to a file, sharing it).

```javascript
<ChatWidget
  // ... other props
  onTranscriptReceived={(transcript) => {
    console.log('Transcript data ready for saving/sharing.');
    // Example: Use Share API (import { Share } from 'react-native';)
    // Share.share({ message: transcript, title: 'Chat Transcript' });
    // Example: Save to file using expo-file-system or react-native-fs
    // (Implementation depends on your project setup)
  }}
/>
```

## API Reference (Props)

| Prop                         | Type                                                                        | Required? | Default                   | Description                                                                                      |
| :--------------------------- | :-------------------------------------------------------------------------- | :-------- | :------------------------ | :----------------------------------------------------------------------------------------------- |
| `isVisible`                  | `boolean`                                                                   | **Yes**   | `false`                   | Controls the visibility of the chat widget.                                                      |
| `apiKey`                     | `string`                                                                    | **Yes**   | -                         | Your Infoset API Key.                                                                            |
| `iosKey`                     | `string`                                                                    | No        | `undefined`               | Your Infoset iOS Platform Key. Recommended if targeting iOS.                                     |
| `androidKey`                 | `string`                                                                    | No        | `undefined`               | Your Infoset Android Platform Key. Recommended if targeting Android.                             |
| `webviewUrl`                 | `string`                                                                    | No        | Infoset CDN URL           | Custom URL for the chat web application.                                                         |
| `visitor`                    | `VisitorType`                                                               | No        | `undefined`               | An object containing information about the visitor.                                              |
| `tags`                       | `string[]`                                                                  | No        | `undefined`               | An array of tags to associate with the chat/visitor.                                             |
| `color`                      | `string`                                                                    | No        | `'#FFFFFF'`               | Background color for the widget's `SafeAreaView`.                                                |
| `statusBarTheme`             | `'auto' \| 'light-content' \| 'dark-content'`                               | No        | `'auto'`                  | Controls the style of the status bar when the widget is visible.                                 |
| `showLoadingIndicator`       | `boolean`                                                                   | No        | `true`                    | Shows a loading indicator while the WebView content is initializing.                             |
| `closeButtonBackgroundColor` | `string`                                                                    | No        | `'rgba(0, 0, 0, 0.2)'`    | Background color of the close button visible during initial loading.                             |
| `closeButtonTextColor`       | `string`                                                                    | No        | Calculated                | Text color of the close button. Calculated based on `color` prop if not provided.                |
| `onWidgetWillShow`           | `() => void \| Promise<void>`                                               | No        | `undefined`               | Callback executed just before the widget's show animation begins.                                |
| `onWidgetShow`               | `() => void`                                                                | No        | `undefined`               | Callback executed after the widget's show animation is complete.                                 |
| `onWidgetWillHide`           | `() => void \| Promise<void>`                                               | No        | `undefined`               | Callback executed just before the widget's hide animation begins.                                |
| `onWidgetHide`               | `() => void`                                                                | No        | `undefined`               | Callback executed after the widget is completely hidden. Use this to set `isVisible` to `false`. |
| `onNewMessage`               | `(payload: { author: Author; message: string; messageId: string }) => void` | No        | `undefined`               | Callback executed when a new message is received.                                                |
| `onRoomOpened`               | `(payload: { roomId: number }) => void`                                     | No        | `undefined`               | Callback executed when a chat room is opened.                                                    |
| `onRoomClosed`               | `(payload: { roomId: number }) => void`                                     | No        | `undefined`               | Callback executed when a chat room is closed.                                                    |
| `onRoomReopened`             | `(payload: { roomId: number }) => void`                                     | No        | `undefined`               | Callback executed when a chat room is reopened.                                                  |
| `onError`                    | `(payload: ErrorPayload) => void`                                           | No        | `undefined`               | Callback executed when an error occurs within the widget or WebView.                             |
| `handleUrl`                  | `(url: string) => void`                                                     | No        | Default (Linking.openURL) | Callback to handle URL clicks from within chat messages.                                         |
| `onTranscriptReceived`       | `(transcript: string) => void`                                              | No        | `undefined`               | Callback executed with the chat transcript string when requested/available from the web widget.  |

## Example App

This repository includes an example application to demonstrate the library's usage:

- **`example/`**: An example app set up with Expo, demonstrating usage in an Expo environment. It should work with Expo Go for this library's core functionality. If you add other native modules to the example, you might need a development client.

Refer to the `App.tsx` file within the `example/src/` directory for a complete usage example.

## Development Setup (For Team Members)

This section outlines how to set up the development environment if you are contributing to this library.

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/Infoset/infoset-react-native.git](https://github.com/Infoset/infoset-react-native.git)
    cd infoset-react-native
    ```
2.  **Install Dependencies:**
    This project uses Yarn workspaces. Install dependencies from the root directory:
    ```bash
    yarn install
    # If you encounter memory issues, try:
    # NODE_OPTIONS="--max-old-space-size=4096" yarn install
    ```
3.  **Building the Library:**
    The library source code is in `src/` and needs to be compiled to `lib/`.
    ```bash
    yarn build
    ```
4.  **Watching for Changes (Recommended for Development):**
    To automatically rebuild the library when you make changes to the `src/` files:
    - Open a terminal in the project root and run:
      ```bash
      yarn watch:build
      ```
    - This will watch for changes and recompile the library.
5.  **Running the Example App (`example`):**

    - In a **separate terminal window**, also in the project root, you can run the Expo example app:
      ```bash
      # To start the Expo development server
      yarn example start
      # Then press 'i' to open in iOS simulator or 'a' for Android emulator/device.
      # Alternatively, to directly launch on a platform:
      # yarn example ios
      # yarn example android
      ```
    - Changes made in the library's `src/` directory, once recompiled by `yarn watch:build`, should reflect in the running example app (Fast Refresh).

6.  **Code Style & Linting:**
    We use ESLint and Prettier for code consistency.
    ```bash
    # Check for linting issues
    yarn lint
    # Attempt to automatically fix linting issues
    # yarn lint --fix (Ensure your ESLint config supports this effectively)
    # Format code with Prettier
    npx prettier --write "**/*.{js,ts,tsx,json,md}"
    ```
7.  **Running Tests:**
    ```bash
    yarn test
    ```

## Versioning and Releasing (For Maintainers)

This project uses [`release-it`](https://github.com/release-it/release-it) with [`@release-it/conventional-changelog`](https://github.com/release-it/conventional-changelog) to automate versioning, changelog generation, Git tagging, npm publishing, and GitHub releases. Commits should follow the [Conventional Commits](https://www.ventionalcommits.org/) specification.

### Prerequisites

- Ensure you have publish access to the `@infoset/react-native` package on npm.
- Ensure all changes are merged into the `master` branch and the branch is clean.
- Ensure all tests are passing.

### Creating a Beta Release

To create a pre-release (e.g., `1.8.0-beta.0`):

1.  Make sure your local `master` branch is up-to-date with the remote.
2.  Run the `release-it` command with `--preRelease=beta` and specify the npm dist-tag:

    ```bash
    npx release-it <version_or_increment> --preRelease=beta --npm.tag=beta
    ```

    - Replace `<version_or_increment>` with the desired version (e.g., `1.8.0`) or an increment keyword like `minor`, `patch`. `release-it` will append the beta part (e.g., `1.8.0-beta.0`).
    - Example for a specific version: `npx release-it 1.8.0 --preRelease=beta --npm.tag=beta`
    - Example for a minor pre-release: `npx release-it minor --preRelease=beta --npm.tag=beta`
    - You can add `--ci` to automate prompts or run it interactively.

    This command will:

    - Bump the version in `package.json` (e.g., to `1.8.0-beta.0`).
    - Generate/update the changelog.
    - Commit these changes.
    - Create a Git tag (e.g., `v1.8.0-beta.0`).
    - Push commits and tags to the remote.
    - Publish the package to npm with the `beta` dist-tag. This prevents it from becoming the `latest` tag.
    - Create a GitHub Release.

Users can then install this beta version using `npm install @infoset/react-native@beta` or `npm install @infoset/react-native@1.8.0-beta.0`.

### Creating a Stable Release

To create a stable release (e.g., `1.8.0`):

1.  Ensure all beta testing is complete and the `master` branch is ready for release.
2.  Run the `release-it` command:

    ```bash
    npx release-it <version_or_increment>
    ```

    - Example for a specific version: `npx release-it 1.8.0`
    - Example for a patch release: `npx release-it patch`

    This command will:

    - Bump the version in `package.json`.
    - Generate/update the changelog.
    - Commit these changes.
    - Create a Git tag (e.g., `v1.8.0`).
    - Push commits and tags to the remote.
    - Publish the package to npm (it will become the `latest` version).
    - Create a GitHub Release.

Always review the changes proposed by `release-it` before confirming.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue on the GitHub repository. Refer to `CONTRIBUTING.md` for more detailed guidelines.

## License

MIT License.
