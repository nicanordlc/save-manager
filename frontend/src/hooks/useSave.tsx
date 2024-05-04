import { useMutation } from "@tanstack/react-query";
import { AddSave } from "@wailsjs/go/backend/Save";

export type SaveSingle = {
  ID: string;
  GameID: string;
  CreatedAt: string;
  Name: string;
};

const useSave = () => {
  const { mutateAsync: addSave } = useMutation({
    mutationFn: (s: Pick<SaveSingle, "Name" | "GameID">) =>
      AddSave(s.Name, s.GameID),
  });

  return { addSave };
};

export default useSave;
