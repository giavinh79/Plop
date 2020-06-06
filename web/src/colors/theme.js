import React, { createContext, useState } from 'react';

/*
 * This file contains theming for the application (provided through Context API)
 */

const isDefaultLightTheme = localStorage.getItem('theme') === 'dark' ? false : true;

// Hex color codes for light theme
export const defaultThemeObject = {
  isLightMode: true,
  header: {
    backgroundColor: '#5885B1',
  },
  team: {
    container: {
      backgroundColor: 'white',
    },
    card: {
      backgroundColor: 'white',
      border: {},
      color: 'rgba(0,0,0,.65)',
    },
    joinedTeamCard: {
      backgroundColor: 'white',
      boxShadow: 'none',
    },
  },
  home: {},
};

// Hex color codes for dark theme
export const darkThemeObject = {
  isLightMode: false,
  header: {
    backgroundColor: '#2d3848',
  },
  team: {
    container: {
      backgroundColor: '#1A2330',
    },
    card: {
      backgroundColor: '#24344C',
      border: 'none',
      color: 'rgba(255, 255, 255, 0.65)',
      titleColor: 'rgba(255, 255, 255, 0.85)',
    },
    joinedTeamCard: {
      backgroundColor: '#00000040',
      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
    },
  },
  home: {},
};

const ThemeContext = createContext(isDefaultLightTheme ? defaultThemeObject : darkThemeObject);

const ThemeProvider = (props) => {
  const [theme, setTheme] = useState(isDefaultLightTheme ? defaultThemeObject : darkThemeObject);
  return <ThemeContext.Provider value={[theme, setTheme]}>{props.children}</ThemeContext.Provider>;
};

export { ThemeProvider, ThemeContext };
