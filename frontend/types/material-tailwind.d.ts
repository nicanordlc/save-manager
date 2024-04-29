import "@material-tailwind/react";

// link:
// https://github.com/creativetimofficial/material-tailwind/issues/651#issuecomment-1999724366
declare module "@material-tailwind/react" {
  export interface InputProps {
    crossOrigin?: unknown;
  }
}
