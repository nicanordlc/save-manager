import { Checkbox } from "@material-tailwind/react";
import { ToggleAlwaysOnTop } from "@wailsjs/go/backend/Settings";
import useSettings from "@/hooks/useSettings";

const Settings = () => {
  const { querySettings } = useSettings();

  return (
    <ul>
      <li>
        <Checkbox
          className=""
          disabled={querySettings.isLoading}
          defaultChecked={querySettings.data?.AlwaysOnTop}
          onClick={ToggleAlwaysOnTop}
          label="Always On Top"
          crossOrigin={undefined}
        />
      </li>
    </ul>
  );
};

export default Settings;
