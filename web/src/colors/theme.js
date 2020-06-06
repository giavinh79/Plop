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

// import { createSlice } from '@reduxjs/toolkit';

/*
 * This file contains theming for non Material-UI components
 * See theme/index.js for Material-UI theming (ie. buttons)
 */

// export interface themeInterface {
//   lightMode: boolean;
//   landing: {
//     backgroundColor: string;
//     formBorderColor?: string;
//     formColor: string;
//     formTextColor: string;
//     formShadow: string;
//     tabSecondaryColor: string;
//     iconColor: string;
//     sloganColor: string;
//   };
//   profile: {
//     headerDefault: string;
//     background: string;
//     navigation: {
//       sideNav: string;
//       sideNavLogos: string;
//     };
//     name: string;
//     role: string;
//   };
// }

// const defaultThemeObject = {
//   lightMode: true,
//   landing: {
//     backgroundColor: 'white',
//     formColor: 'white',
//     formTextColor: 'rgba(0, 0, 0, 0.54)',
//     formShadow: '0 5px 10px rgba(154,160,185,.05), 0 15px 40px rgba(166,173,201,.2)',
//     tabSecondaryColor: '',
//     iconColor: '#666',
//     sloganColor: '#666',
//   },
//   profile: {
//     headerDefault: '#EDF0F3',
//     background: '#FAFAFA',
//     navigation: {
//       sideNav: '#282C34',
//       sideNavLogos: '#FFFFFF',
//     },
//     name: '#202020',
//     role: '#387138',
//   },
// };

// // Must possess same JSON properties as default theme object
// export const darkThemeObject = {
//   lightMode: false,
//   landing: {
//     backgroundColor: '#282C34',
//     formBorderColor: '#484848',
//     formColor: '#1f1f1f',
//     formTextColor: '#68c36f',
//     formShadow: '0 -2px 10px rgba(0, 0, 0, 1)',
//     tabSecondaryColor: '#d6d6d6',
//     iconColor: '#e8e8e8',
//     sloganColor: '#e8e8e8',
//   },
//   profile: {
//     headerDefault: 'white',
//     background: '#282C34',
//     navigation: {
//       sideNav: '#FAFAFA',
//       sideNavLogos: 'black',
//     },
//     name: '#202020',
//     role: '#387138',
//   },
// };

// export const themeSlice = createSlice({
//   name: 'theme',
//   initialState: defaultThemeObject,
//   reducers: {
//     activateDefaultTheme: (state) => defaultThemeObject,
//     activateDarkTheme: (state) => darkThemeObject,
//   },
// });

// export const { activateDefaultTheme, activateDarkTheme } = themeSlice.actions;
// export default themeSlice.reducer;
