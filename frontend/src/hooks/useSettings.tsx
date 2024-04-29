import { ReadSettings } from "@wailsjs/go/backend/Settings";
import { useEffect, useState } from "react";

type Settings = {
  AlwaysOnTop: boolean;
};

const useSettings = () => {
  const [settings, setSettings] = useState<Settings>();
  useEffect(() => {
    ReadSettings()
      .then((data) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setSettings(data);
      })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      .catch((err) => err);
  }, []);

  return settings;
};

export default useSettings;
