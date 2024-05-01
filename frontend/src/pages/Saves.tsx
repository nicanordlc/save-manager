import clsx from "clsx";
import { Card } from "@material-tailwind/react";
import useMenuMiddleItem from "@/hooks/useMenuMiddleItem";
import AddGame from "@/components/AddGame";
import useGame from "@/hooks/useGame";
import Game from "@/components/Game";

const Saves = () => {
  useMenuMiddleItem(<AddGame />);
  const { data } = useGame();

  return (
    <Card className="h-0 grow overflow-y-auto p-2" color="indigo">
      <ul className={clsx("mb-4", "flex flex-wrap justify-around gap-3")}>
        {data?.Data.map(({ Name }) => (
          <Game key={`game-${Math.random()}`} title={Name} />
        ))}
        {/* <Game title="DS1" />
        <Game title="Game" />
        <Game title="Game" />
        <Game title="Game" /> */}
      </ul>
    </Card>
  );
};

export default Saves;
