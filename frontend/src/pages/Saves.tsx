import clsx from "clsx";
import useMenuMiddleItem from "@/hooks/useMenuMiddleItem";
import AddGame from "@/components/AddGame";
import useGame, { type Game as TGame } from "@/hooks/useGame";
import Game from "@/components/Game";
import NoGame from "@/components/NoGame";

const Saves = () => {
  useMenuMiddleItem(<AddGame />);
  const { query: queryGames, removeGame } = useGame<TGame>({
    queryKey: "games",
  });

  const jsonData = queryGames.data?.Data;
  const hasGame = Array.isArray(jsonData) ? jsonData.length : jsonData;

  if (!hasGame) {
    return <NoGame />;
  }

  return (
    <ul className={clsx("mb-4", "flex flex-wrap justify-around gap-3")}>
      {queryGames.data?.Data?.map(({ Name, ID }) => {
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
  );
};

export default Saves;
