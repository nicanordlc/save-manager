import { IconButton } from "@material-tailwind/react";
import clsx from "clsx";
import { FaPlus } from "react-icons/fa6";
import Game from "@/components/Game";
import useMenuMiddleItem from "@/hooks/useMenuMiddleItem";

const Saves = () => {
  useMenuMiddleItem(
    <IconButton>
      <FaPlus />
    </IconButton>,
  );

  return (
    <main>
      <ul className={clsx("mb-4", "flex flex-wrap justify-around gap-2")}>
        <Game />
        <Game />
        <Game />
        <Game />
        <Game />
        <Game />
        <Game />
        <Game />
        <Game />
        <Game />
        <Game />
        <Game />
        <Game />
      </ul>
    </main>
  );
};

export default Saves;
