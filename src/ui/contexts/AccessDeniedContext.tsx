import { PropsWithChildren, createContext, useEffect, useState } from 'react';
import { DASHBOARD_ACCESS_DENIED_EVENT } from 'event';

export const AccessDeniedPopupContext = createContext<{
  hidePopup: () => void;
  isPopupVisible: boolean;
  popupMessage: string;
}>({
  isPopupVisible: false,
  popupMessage: '',
  hidePopup: () => {
    return;
  },
});

export const AccessDeniedContextProvider: React.FC<PropsWithChildren> = (
  props: PropsWithChildren,
) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const handleAccessDenied = (e: CustomEvent) => {
    if (isPopupVisible) return;

    const message = e.detail.message;

    setPopupMessage(message);
    setIsPopupVisible(true);
  };

  useEffect(() => {
    window.addEventListener(
      DASHBOARD_ACCESS_DENIED_EVENT,
      handleAccessDenied as EventListener,
    );
  }, []);

  const hidePopup = () => {
    if (!isPopupVisible) return;

    setPopupMessage('');
    setIsPopupVisible(false);
  };

  return (
    <AccessDeniedPopupContext.Provider
      value={{
        isPopupVisible,
        popupMessage,
        hidePopup,
      }}
    >
      {props.children}
    </AccessDeniedPopupContext.Provider>
  );
};
