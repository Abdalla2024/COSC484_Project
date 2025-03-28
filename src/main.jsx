import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
// core styles are required for all packages
import '@mantine/core/styles.css';
import { AuthProvider } from './auth/Auth'

// other css files are required only if
// you are using components from the corresponding package
// import '@mantine/dates/styles.css';
// import '@mantine/dropzone/styles.css';
// import '@mantine/code-highlight/styles.css';
// ...
import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  /** Put your mantine theme override here */
});
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider theme={theme}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MantineProvider>

    </BrowserRouter>
  </React.StrictMode>,
)
