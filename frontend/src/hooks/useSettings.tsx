import { useQuery } from "@tanstack/react-query";
import { ReadSettings } from "@wailsjs/go/backend/Settings";

type Settings = {
  AlwaysOnTop: boolean;
};

const useSettings = () => {
  const querySettings = useQuery<Settings>({
    queryKey: ["settings"],
    queryFn: ReadSettings,
  });
  return { querySettings };
};

export default useSettings;
