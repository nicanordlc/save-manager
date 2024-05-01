import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AddGame,
  FindGame,
  ReadGames,
  RemoveGame,
} from "@wailsjs/go/backend/Game";

export type GameSingle = {
  ID: string;
  Name: string;
  SavePath: string;
};

export type Game = {
  Data: GameSingle[];
};

type QueryKeys = "game" | "games";

type UseGame = {
  queryKey: QueryKeys;
  queryArgs: Partial<GameSingle>;
};

const useGame = <T,>(props?: Partial<UseGame>) => {
  const queryClient = useQueryClient();

  const query = useQuery<T>({
    queryKey: [props?.queryKey ?? "games"] as QueryKeys[],
    queryFn: () => {
      switch (props?.queryKey) {
        case "game": {
          return FindGame(props.queryArgs?.ID);
        }
        default: {
          return ReadGames();
        }
      }
    },
  });

  const invalidateGamesQuery = () =>
    queryClient.invalidateQueries({
      queryKey: [props?.queryKey ?? "games"] as QueryKeys[],
    });

  const { mutateAsync: removeGame } = useMutation({
    onSuccess: invalidateGamesQuery,
    mutationFn: (g: Pick<GameSingle, "ID">) => RemoveGame(g.ID),
  });

  const { mutateAsync: addGame } = useMutation({
    onSuccess: invalidateGamesQuery,
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
