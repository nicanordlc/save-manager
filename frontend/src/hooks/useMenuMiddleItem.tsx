import { useEffect } from "react";
import menuMiddleItem, { DEFAULT_MENU_MIDDLE_ITEM } from "@/signals/menu";

const useMenuMiddleItem = (element: JSX.Element) => {
  useEffect(() => {
    menuMiddleItem.value = element;

    return () => {
      menuMiddleItem.value = DEFAULT_MENU_MIDDLE_ITEM;
    };
  }, [element]);
};

export default useMenuMiddleItem;
