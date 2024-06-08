import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AddGame,
  FindGame,
  ReadData,
  RemoveGame,
  UpdateGame,
} from "@wailsjs/go/backend/Game";
import { RemoveSaveForGame } from "@wailsjs/go/backend/Save";

export type GameSingle = {
  ID: string;
  Name: string;
  SavePath: string;
  SavePathIsFile: boolean;
};

export type Game = {
  Data?: GameSingle[];
};

type QueryKeys = "game" | "games";

type UseGame = {
  queryKey: QueryKeys;
  queryArgs: Partial<GameSingle>;
};

const useGame = <T,>(props?: Partial<UseGame>) => {
  const queryClient = useQueryClient();

  const queryGame = useQuery<T>({
    queryKey: [props?.queryKey ?? "games"] as QueryKeys[],
    queryFn: () => {
      switch (props?.queryKey) {
        case "game": {
          return FindGame(props.queryArgs?.ID);
        }
        default: {
          return ReadData();
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
    mutationFn: async (g: Pick<GameSingle, "ID">) => {
      await RemoveGame(g.ID);
      await RemoveSaveForGame(g.ID);
    },
  });

  const { mutateAsync: addGame } = useMutation({
    onSuccess: invalidateGamesQuery,
    mutationFn: (g: Pick<GameSingle, "Name" | "SavePath" | "SavePathIsFile">) =>
      AddGame(g.Name, g.SavePath, Boolean(g.SavePathIsFile)),
  });

  const { mutateAsync: updateGame } = useMutation({
    onSuccess: invalidateGamesQuery,
    mutationFn: (g: GameSingle) => UpdateGame(g),
  });

  return {
    invalidateGamesQuery,
    queryGame,
    removeGame,
    addGame,
    updateGame,
  };
};

export default useGame;
