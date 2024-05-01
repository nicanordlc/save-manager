import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import {
  type IconButtonStyleTypes,
  ThemeProvider,
  type CardHeaderStylesType,
} from "@material-tailwind/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "@/App";
import "@/index.css";

const iconButton: IconButtonStyleTypes = {
  defaultProps: {
    size: "lg",
    variant: "gradient",
    color: "gray",
  },
};

const cardHeader: CardHeaderStylesType = {
  defaultProps: {
    variant: "gradient",
    color: "gray",
  },
};

const theme = {
  iconButton,
  cardHeader,
};

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider value={theme}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>,
);
