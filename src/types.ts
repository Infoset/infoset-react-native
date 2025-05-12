// src/types.ts

/**
 * Defines the structure for visitor data passed to the chat widget.
 */
export type VisitorType = {
  id?: number | string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  userHash?: string; // Can be used for secure identification
  createdAt?: string; // ISO 8601 formatted date string
  company?: string;
  customFields?: Record<string, any>; // Flexible custom data
};

/**
 * Defines the structure for message author information.
 */
export type Author = {
  userId: string;
  userName: string;
  avatar?: string;
  connectionId?: string;
};

/**
 * Defines the structure for error payloads passed via the onError callback.
 */
export type ErrorPayload = {
  code: string; // e.g., 'INVALID_URL', 'WEBVIEW_LOAD_ERROR', 'MISSING_PROPS'
  message: string;
  error?: any; // Optional underlying error object
  data?: any; // Optional related data
};

/**
 * Defines the structure for messages received from the WebView via postMessage.
 */
export type ChatMessagePayload = {
  messageType: ChatMessageTypes;
  data?: any; // Data associated with the message type
};

/**
 * Defines the possible message types received from the WebView.
 */
export type ChatMessageTypes =
  | 'uiReady'
  | 'newMessage'
  | 'hideChatWindow' // Message asking the widget to hide
  | 'roomOpened'
  | 'roomClosed'
  | 'roomReopened'
  | 'error' // Error originating from within the web application
  | 'onDownloadTranscript'; // Message carrying transcript data

/**
 * Defines the props accepted by the ChatWidget component.
 */
export type ChatWidgetProps = {
  // --- Core Configuration ---
  /** Sets the visibility of the chat widget. */
  isVisible: boolean;
  /** Your Infoset Chat Widget API Key. */
  apiKey: string;
  /** Your Infoset Chat Widget iOS Platform Key (Optional, but recommended). */
  iosKey?: string;
  /** Your Infoset Chat Widget Android Platform Key (Optional, but recommended). */
  androidKey?: string;
  /** The URL for the chat widget web application. Defaults to Infoset's CDN. */
  webviewUrl?: string;
  /** An object containing visitor information. */
  visitor?: VisitorType;
  /** An array of tags to associate with the visitor/chat. */
  tags?: string[];

  // --- Customization ---
  /** The background color for the widget's safe area. Defaults to white. */
  color?: string;
  /** Controls the status bar appearance ('auto', 'light-content', 'dark-content'). Defaults to 'auto'. */
  statusBarTheme?: 'auto' | 'light-content' | 'dark-content';
  /** Whether to show the loading indicator while the WebView is loading/initializing. Defaults to true. */
  showLoadingIndicator?: boolean;
  /** Background color for the close button shown during loading. */
  closeButtonBackgroundColor?: string;
  /** Text color for the close button shown during loading. Calculated based on `color` if not provided. */
  closeButtonTextColor?: string;

  // --- Event Callbacks ---
  /** Called when a new message is received from the agent or bot. */
  onNewMessage?: (payload: {
    author: Author;
    message: string;
    messageId: string;
  }) => void;
  /** Called when a chat room is opened. */
  onRoomOpened?: (payload: { roomId: number }) => void;
  /** Called when a chat room is closed. */
  onRoomClosed?: (payload: { roomId: number }) => void;
  /** Called when a chat room is reopened. */
  onRoomReopened?: (payload: { roomId: number }) => void;

  // --- Widget Lifecycle Callbacks ---
  /** Called just before the widget starts its show animation. Can return a Promise. */
  onWidgetWillShow?: () => void | Promise<void>;
  /** Called after the widget's show animation is complete. */
  onWidgetShow?: () => void;
  /** Called just before the widget starts its hide animation. Can return a Promise. */
  onWidgetWillHide?: () => void | Promise<void>;
  /** Called after the widget's hide animation is complete. Often used to set `isVisible` prop to false. */
  onWidgetHide?: () => void;

  // --- Error Callback ---
  /** Called when an error occurs within the widget or WebView interaction. */
  onError?: (payload: ErrorPayload) => void;

  // --- Behavior Callbacks ---
  /** Optional handler for URLs opened from within the WebView. If not provided, uses Linking.openURL. */
  handleUrl?: (url: string) => void;
  /** Called when transcript data is received from the WebView. The consuming app should handle saving/sharing. */
  onTranscriptReceived?: (transcript: string) => void;
};
