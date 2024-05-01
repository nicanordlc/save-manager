import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddGame, ReadGames, RemoveGame } from "@wailsjs/go/backend/Game";

export type GameSingle = {
  ID: string;
  Name: string;
  SavePath: string;
};

export type Game = {
  Data: GameSingle[];
};

export const QUERY_KEYS = {
  games: "games",
  game: "game",
} as const;

const useGame = () => {
  const queryClient = useQueryClient();

  const queryGames = useQuery<Game>({
    queryKey: [QUERY_KEYS.games],
    queryFn: ReadGames,
  });

  const { mutateAsync: removeGame } = useMutation({
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.games],
      });
    },
    mutationFn: (g: Pick<GameSingle, "ID">) => RemoveGame(g.ID),
  });

  const { mutateAsync: addGame } = useMutation({
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.games],
      });
    },
    mutationFn: (g: Pick<GameSingle, "Name" | "SavePath">) =>
      AddGame(g.Name, g.SavePath),
  });

  return {
    queryGames,
    removeGame,
    addGame,
  };
};

export default useGame;
