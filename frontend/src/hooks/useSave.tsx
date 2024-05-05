import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddSave, GetSaves, RemoveSave } from "@wailsjs/go/backend/Save";

export type SaveSingle = {
  ID: string;
  GameID: string;
  CreatedAt: string;
  Name: string;
};

const QUERY_KEY = "saves";

const useSave = (props?: Pick<SaveSingle, "GameID">) => {
  const queryClient = useQueryClient();

  const query = useQuery<SaveSingle[]>({
    queryKey: [QUERY_KEY],
    queryFn: () => GetSaves(props?.GameID),
  });

  const invalidateSavesQuery = () =>
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });

  const { mutateAsync: addSave } = useMutation({
    onSuccess: invalidateSavesQuery,
    mutationFn: (s: Pick<SaveSingle, "Name" | "GameID">) =>
      AddSave(s.Name, s.GameID),
  });

  const { mutateAsync: removeSave } = useMutation({
    onSuccess: invalidateSavesQuery,
    mutationFn: (s: Pick<SaveSingle, "ID" | "GameID">) =>
      RemoveSave(s.ID, s.GameID),
  });

  return { query, addSave, removeSave };
};

export default useSave;
