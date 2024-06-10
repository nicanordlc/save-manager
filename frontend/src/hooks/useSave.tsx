import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AddQuicksave,
  AddSave,
  GetQuickSave,
  GetSaves,
  LoadQuickSave,
  LoadSave,
  OverwriteSave,
  RemoveQuickSave,
  RemoveSave,
  UpdateSave,
} from "@wailsjs/go/backend/Save";

export type SaveSingle = {
  ID: string;
  GameID: string;
  CreatedAt: string;
  Name: string;
};

const QUERY_KEY = "saves";
const QUERY_KEY_QUICK_SAVE = "quicksave";

const useSave = (props?: Pick<SaveSingle, "GameID">) => {
  const queryClient = useQueryClient();

  const querySaves = useQuery<SaveSingle[]>({
    queryKey: [QUERY_KEY],
    queryFn: () => GetSaves(props?.GameID),
  });

  const queryQuickSave = useQuery<boolean>({
    queryKey: [QUERY_KEY_QUICK_SAVE],
    queryFn: () => GetQuickSave(props?.GameID),
  });

  const invalidateSavesQuery = () =>
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });

  const invalidateQuickSaveQuery = () =>
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY_QUICK_SAVE] });

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

  const { mutateAsync: addQuickSave } = useMutation({
    onSuccess: invalidateQuickSaveQuery,
    mutationFn: (s: Pick<SaveSingle, "GameID">) => AddQuicksave(s.GameID),
  });

  const { mutateAsync: removeQuickSave } = useMutation({
    onSuccess: invalidateQuickSaveQuery,
    mutationFn: (s: Pick<SaveSingle, "GameID">) => RemoveQuickSave(s.GameID),
  });

  const { mutateAsync: loadSave } = useMutation({
    mutationFn: (s: Pick<SaveSingle, "ID" | "GameID">) =>
      LoadSave(s.ID, s.GameID),
  });

  const { mutateAsync: loadQuickSave } = useMutation({
    mutationFn: (s: Pick<SaveSingle, "GameID">) => LoadQuickSave(s.GameID),
  });

  const { mutateAsync: overwriteSave } = useMutation({
    mutationFn: (s: Pick<SaveSingle, "ID" | "GameID">) =>
      OverwriteSave(s.ID, s.GameID),
  });

  const { mutateAsync: updateSave } = useMutation({
    mutationFn: (s: Pick<SaveSingle, "ID" | "GameID" | "Name">) =>
      UpdateSave(s.ID, s.GameID, s.Name),
    onSuccess: invalidateSavesQuery,
  });

  return {
    querySaves,
    queryQuickSave,
    addSave,
    addQuickSave,
    removeSave,
    removeQuickSave,
    loadSave,
    loadQuickSave,
    overwriteSave,
    updateSave,
  };
};

export default useSave;
