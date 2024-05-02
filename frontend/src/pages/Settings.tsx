import { Checkbox } from "@material-tailwind/react";
import { ToggleAlwaysOnTop } from "@wailsjs/go/backend/Settings";
import useSettings from "@/hooks/useSettings";

const Settings = () => {
  const { query: querySettings, updateSettings } = useSettings();

  const handleOption = async (cb: () => Promise<boolean>) => {
    await cb();
    await updateSettings();
  };

  return (
    <ul>
      <li>
        <Checkbox
          className=""
          disabled={querySettings.isLoading}
          defaultChecked={querySettings.data?.AlwaysOnTop}
          onClick={() => handleOption(ToggleAlwaysOnTop)}
          label="Always On Top"
          crossOrigin={undefined}
        />
      </li>
    </ul>
  );
};

export default Settings;
