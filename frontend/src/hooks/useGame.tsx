import { useQuery } from "@tanstack/react-query";
import { ReadGames } from "@wailsjs/go/backend/Game";

type GameSingle = {
  UUID: string;
  Name: string;
  SavePath: string;
};

type Game = {
  Data: GameSingle[];
};

const useGame = () => {
  const query = useQuery<Game>({
    queryKey: ["game"],
    queryFn: ReadGames,
  });
  return query;
};

export default useGame;
