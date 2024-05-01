import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddGame, ReadGames, RemoveGame } from "@wailsjs/go/backend/Game";

type GameSingle = {
  UUID: string;
  Name: string;
  SavePath: string;
};

type Game = {
  Data: GameSingle[];
};

const QUERY_KEY = "game";

const useGame = () => {
  const queryClient = useQueryClient();

  const query = useQuery<Game>({
    queryKey: [QUERY_KEY],
    queryFn: ReadGames,
  });

  const { mutateAsync: removeGame } = useMutation({
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    mutationFn: (g: Pick<GameSingle, "UUID">) => RemoveGame(g.UUID),
  });

  const { mutateAsync: addGame } = useMutation({
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    mutationFn: (g: Pick<GameSingle, "Name" | "SavePath">) =>
      AddGame(g.Name, g.SavePath),
  });

  return {
    query,
    removeGame,
    addGame,
  };
};

export default useGame;
