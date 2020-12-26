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
  handleUrl?: (url: string) => void;
  visitor?: VisitorType;
  tags?: string[];
};

export type ChatMessageTypes =
  | 'uiReady'
  | 'newMessage'
  | 'hideChatWindow'
  | 'error';
