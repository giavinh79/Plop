import React, { createContext, useState } from 'react';

/*
 * This file contains theming for the application (provided through Context API)
 * Some CSS files need to be manually edited due to limits of some antd components
 */

const isDefaultLightTheme = localStorage.getItem('theme') === 'dark' ? false : true;

export const defaultThemeObject = {
  isLightMode: true,
  textColor: 'rgba(0,0,0,.65)',

  /* General Components */
  header: {
    backgroundColor: '#5885B1',
  },
  chat: {
    iconBoxShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
  },

  /* Team Page */
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

  /* Dashboard Sections */
  home: {
    backgroundColor: 'white',
    filterBgColor: '#f7f7f7',
    cardBgColor: 'white',
    cardBgColorOverdue: 'white',
  },
  overview: {
    tableBgColor: 'white',
  },
  schedule: {
    issueBorder: '1px solid #e8e8e8',
  },
  note: {
    gridBgColor: 'white',
    gridBorder: '1px solid #e8e8e8',
  },
};

export const darkThemeObject = {
  isLightMode: false,
  textColor: '#e8e8e8',

  /* General Components */
  header: {
    backgroundColor: '#2d3848',
  },
  chat: {
    iconBoxShadow: '0px 0px 5px 0px #FFFFFF',
  },

  /* Team Page */
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

  /* Dashboard Sections */
  home: {
    backgroundColor: '#1A2330', // should match side nav background for dark theme
    leftBorder: '12px solid #2d3848', // color should match dark theme header bg color
    filterBgColor: '#1A2330', // should match dark home backgroundColor
    cardBgColor: '#2F4861',
    cardBgColorOverdue: '#824141',
  },
  overview: {
    tableBgColor: '#323a46',
  },
  schedule: {
    issueBorder: 'none',
  },
  note: {
    gridBgColor: '#323a46',
    gridBorder: 'none',
  },
};

const ThemeContext = createContext(isDefaultLightTheme ? defaultThemeObject : darkThemeObject);

const ThemeProvider = (props) => {
  const [theme, setTheme] = useState(isDefaultLightTheme ? defaultThemeObject : darkThemeObject);
  return <ThemeContext.Provider value={[theme, setTheme]}>{props.children}</ThemeContext.Provider>;
};

export { ThemeProvider, ThemeContext };
