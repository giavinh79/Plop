import React, { createContext, useState } from 'react';

// Provides state to components that need to be triggered on new websocket notifications

const NotificationContext = createContext(0);

const NotificationProvider = (props) => {
  const [notification, setNotification] = useState(0);
  return <NotificationContext.Provider value={[theme, setTheme]}>{props.children}</NotificationContext.Provider>;
};

export { NotificationProvider, NotificationContext };
