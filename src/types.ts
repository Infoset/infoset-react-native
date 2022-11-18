export type VisitorType = {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  userHash?: string;
  createdAt?: string;
  company?: string;
  customFields?: object;
};

export type Author = {
  userId: string;
  userName: string;
  avatar: string;
  connectionId: string;
};

export type ChatWidgetProps = {
  isVisible: boolean;
  apiKey?: string;
  color?: string;
  iosKey?: string;
  androidKey?: string;
  onNewMessage?: (payload: {
    author: Author;
    message: string;
    messageId: string;
  }) => void;
  onRoomOpened?: (payload: { roomId: number }) => void;
  onRoomClosed?: (payload: { roomId: number }) => void;
  onRoomReopened?: (payload: { roomId: number }) => void;
  onWidgetWillShow?: () => void;
  onWidgetShow?: () => void;
  onWidgetWillHide?: () => void;
  onWidgetHide?: () => void;
  handleUrl?: (url: string) => void;
  visitor?: VisitorType;
  tags?: string[];
};

export type ChatMessageTypes =
  | 'uiReady'
  | 'newMessage'
  | 'hideChatWindow'
  | 'roomOpened'
  | 'roomClosed'
  | 'roomReopened'
  | 'error';
