import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import {
  type IconButtonStyleTypes,
  ThemeProvider,
} from "@material-tailwind/react";
import App from "@/App";
import "@/index.css";

const iconButton: IconButtonStyleTypes = {
  defaultProps: {
    size: "lg",
    color: "lime",
  },
};

const theme = {
  iconButton,
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider value={theme}>
        <App />
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>,
);
