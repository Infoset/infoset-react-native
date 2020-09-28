export type WidgetProps = {
  isVisible: boolean;
  enableOpenLinksWithBrowser?: boolean;
  apiKey?: string;
  color?: string;
  iosKey?: string;
  androidKey?: string;
  onNewMessage?: () => void;
  onWidgetWillShow?: () => void;
  onWidgetShow?: () => void;
  onWidgetWillHide?: () => void;
  onWidgetHide?: () => void;
  getLink?: (url: string) => void;
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
