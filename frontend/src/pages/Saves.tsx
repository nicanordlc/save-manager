import clsx from "clsx";
import { Card } from "@material-tailwind/react";
import useMenuMiddleItem from "@/hooks/useMenuMiddleItem";
import AddGame from "@/components/AddGame";
import useGame from "@/hooks/useGame";
import Game from "@/components/Game";

const Saves = () => {
  useMenuMiddleItem(<AddGame />);
  const { query, removeGame } = useGame();

  return (
    <Card className="h-0 grow overflow-y-auto p-2" color="indigo">
      <ul className={clsx("mb-4", "flex flex-wrap justify-around gap-3")}>
        {query.data?.Data.map(({ Name, UUID }) => {
          return (
            <Game
              key={`game-${Math.random()}`}
              title={Name}
              remove={() => removeGame({ UUID })}
            />
          );
        })}
      </ul>
    </Card>
  );
};

export default Saves;
