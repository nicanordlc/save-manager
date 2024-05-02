import { useQuery } from "@tanstack/react-query";
import { ReadSettings } from "@wailsjs/go/backend/Settings";

type Settings = {
  AlwaysOnTop: boolean;
};

export const QUERY_KEY = "settings";

const useSettings = () => {
  const querySettings = useQuery<Settings>({
    queryKey: [QUERY_KEY],
    queryFn: ReadSettings,
  });
  return { querySettings };
};

export default useSettings;
