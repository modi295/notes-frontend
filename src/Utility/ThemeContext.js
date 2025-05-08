import { createContext } from "react";

const ThemeContext = createContext({
  mode: "light",
  toggleTheme: () => {},
});

export default ThemeContext;
