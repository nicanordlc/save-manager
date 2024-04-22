import clsx from "clsx";
import { Card } from "@material-tailwind/react";
import Game from "@/components/Game";
import useMenuMiddleItem from "@/hooks/useMenuMiddleItem";
import AddGame from "@/components/AddGame";

const Saves = () => {
  useMenuMiddleItem(<AddGame />);

  return (
    <Card className="h-0 grow overflow-y-auto p-2" color="indigo">
      <ul className={clsx("mb-4", "flex flex-wrap justify-around gap-3")}>
        <Game title="DS1" />
        <Game title="Game" />
        <Game title="Game" />
        <Game title="Game" />
      </ul>
    </Card>
  );
};

export default Saves;
