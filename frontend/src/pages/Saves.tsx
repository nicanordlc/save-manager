import clsx from "clsx";
import { Card } from "@material-tailwind/react";
import useMenuMiddleItem from "@/hooks/useMenuMiddleItem";
import AddGame from "@/components/AddGame";
import useGame, { type Game as TGame } from "@/hooks/useGame";
import Game from "@/components/Game";

const Saves = () => {
  useMenuMiddleItem(<AddGame />);
  const { query: queryGames, removeGame } = useGame<TGame>({
    queryKey: "games",
  });

  return (
    <Card className="h-0 grow overflow-y-auto p-2" color="indigo">
      <ul className={clsx("mb-4", "flex flex-wrap justify-around gap-3")}>
        {queryGames.data?.Data.map(({ Name, ID }) => {
          return (
            <Game
              key={`game-${Math.random()}`}
              Name={Name}
              ID={ID}
              remove={() => removeGame({ ID })}
            />
          );
        })}
      </ul>
    </Card>
  );
};

export default Saves;
