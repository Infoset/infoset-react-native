export type WidgetProps = {
  isVisible: boolean;
  apiKey?: string;
  color?: string;
  onNewMessage?: () => void;
  onWidgetWillShow?: () => void;
  onWidgetShow?: () => void;
  onWidgetWillHide?: () => void;
  onWidgetHide?: () => void;
  iosKey?: string;
  androidKey?: string;
  visitor?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    photoUrl?: string;
    userHash?: string;
    createdAt?: string;
    company?: string;
  };
};

export type MessageTypes = 'uiReady' | 'newMessage' | 'hideChatWindow';
