import { IconButton } from "@material-tailwind/react";
import { signal } from "@preact/signals-react";
import { FaHeartCrack } from "react-icons/fa6";

export const DEFAULT_MENU_MIDDLE_ITEM = (
  <IconButton disabled>
    <FaHeartCrack />
  </IconButton>
);

const menuMiddleItem = signal(DEFAULT_MENU_MIDDLE_ITEM);

export default menuMiddleItem;
