export type UserType = {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  userHash?: string;
  createdAt?: string;
  company?: string;
};

export type ChatWidgetProps = {
  isVisible: boolean;
  apiKey?: string;
  color?: string;
  iosKey?: string;
  androidKey?: string;
  onNewMessage?: () => void;
  onWidgetWillShow?: () => void;
  onWidgetShow?: () => void;
  onWidgetWillHide?: () => void;
  onWidgetHide?: () => void;
  handleUrls?: (url: string) => void;
  user?: UserType;
  tags?: string[];
};

export type ChatMessageTypes = 'uiReady' | 'newMessage' | 'hideChatWindow';
