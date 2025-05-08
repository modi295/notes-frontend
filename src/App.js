import './App.css';
import { RouterProvider } from "react-router-dom";
import router from './Routes/Routes';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { useMemo, useState, useEffect } from 'react';
import { getDesignTokens } from './Utility/Theme';
import ThemeContext from './Utility/ThemeContext'; 

function App() {
  const [mode, setMode] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
        <ToastContainer position="bottom-right" theme={mode} />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
