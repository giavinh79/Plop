import React, { createContext, useState } from 'react';

// Constants used for dark mode
export const DARK_TEXT_COLOR = '#somehexvalue';
export const DARK_HEADER_COLOR = '#somehexvalue';
export const DARK_SIDE_NAV_COLOR = '#somehexvalue';
export const DARK_BACKGROUND_COLOR = '#somehexvalue';

// Constants used for light mode
export const LIGHT_TEXT_COLOR = '#somehexvalue';
export const LIGHT_HEADER_COLOR = '#somehexvalue';
export const LIGHT_SIDE_NAV_COLOR = '#somehexvalue';
export const LIGHT_BACKGROUND_COLOR = '#somehexvalue';

// ThemeContext
const defaultLightTheme = localStorage.getItem('theme') === 'dark' ? false : true;

const ThemeContext = createContext({
  isLightMode: defaultLightTheme,
});

const ThemeProvider = (props) => {
  const [theme, setTheme] = useState({
    isLightMode: defaultLightTheme,
  });
  return <ThemeContext.Provider value={[theme, setTheme]}>{props.children}</ThemeContext.Provider>;
};

export { ThemeProvider, ThemeContext };
