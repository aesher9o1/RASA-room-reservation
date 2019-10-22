import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
*,
  *::after,
  *::before {
    box-sizing: border-box;
  }
  body {
    background: ${({ theme }) => theme.body};
    height: 100vh;
    margin: 0;
    padding: 0;
    transition: all 0.4s linear;
  }`
