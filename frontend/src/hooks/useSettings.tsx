import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ReadData,
  SetDefaultAppConfigPath,
  SetDefaultSavePath,
  ToggleAlwaysOnTop,
} from "@wailsjs/go/backend/Settings";

type Settings = {
  AlwaysOnTop: boolean;
  DefaultSavePath: string;
  DefaultAppConfigPath: string;
  DefaultSavePathIsFile: boolean;
};

export const QUERY_KEY = "settings";

const useSettings = () => {
  const queryClient = useQueryClient();

  const querySettings = useQuery<Settings>({
    queryKey: [QUERY_KEY],
    queryFn: ReadData,
  });

  const updateSettings = () =>
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });

  const { mutateAsync: toggleAlwaysOnTop } = useMutation({
    onSuccess: updateSettings,
    mutationFn: () => ToggleAlwaysOnTop(),
  });

  const { mutateAsync: setDefaultSavePath } = useMutation({
    onSuccess: updateSettings,
    mutationFn: (
      s: Pick<Settings, "DefaultSavePath" | "DefaultSavePathIsFile">,
    ) => SetDefaultSavePath(s.DefaultSavePath, s.DefaultSavePathIsFile),
  });

  const { mutateAsync: setDefaultAppConfigPath } = useMutation({
    onSuccess: updateSettings,
    mutationFn: (s: Pick<Settings, "DefaultAppConfigPath">) =>
      SetDefaultAppConfigPath(s.DefaultAppConfigPath),
  });

  return {
    querySettings,
    updateSettings,
    setDefaultSavePath,
    toggleAlwaysOnTop,
    setDefaultAppConfigPath,
  };
};

export default useSettings;
