import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ReadSettings } from "@wailsjs/go/backend/Settings";

type Settings = {
  AlwaysOnTop: boolean;
};

export const QUERY_KEY = "settings";

const useSettings = () => {
  const queryClient = useQueryClient();

  const query = useQuery<Settings>({
    queryKey: [QUERY_KEY],
    queryFn: ReadSettings,
  });

  const updateSettings = () =>
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });

  return { query, updateSettings };
};

export default useSettings;
