import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    line-height: 1.5;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f7fafc;
    color: #2d3748;
    transition: direction 0.3s ease;
  }

  /* RTL Support */
  [dir="rtl"] {
    font-family: 'Segoe UI', 'Arial', 'Tahoma', sans-serif;
  }

  /* RTL-specific adjustments */
  [dir="rtl"] button,
  [dir="rtl"] input,
  [dir="rtl"] select,
  [dir="rtl"] textarea {
    text-align: right;
  }

  [dir="rtl"] .status-card {
    text-align: right;
  }

  /* Progress bar RTL support */
  [dir="rtl"] .progress-bar {
    direction: ltr; /* Keep progress bars LTR for consistency */
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  button {
    font-family: inherit;
  }

  input, select, textarea {
    font-family: inherit;
  }

  /* Focus styles for accessibility */
  *:focus {
    outline: 2px solid #3182ce;
    outline-offset: 2px;
  }

  /* Remove focus outline for mouse users */
  *:focus:not(:focus-visible) {
    outline: none;
  }

  /* Ensure focus is visible for keyboard users */
  *:focus-visible {
    outline: 2px solid #3182ce;
    outline-offset: 2px;
  }

  /* Smooth transitions for language changes */
  * {
    transition: margin 0.3s ease, padding 0.3s ease;
  }
`;