import { Card, Checkbox } from "@material-tailwind/react";
import { ToggleAlwaysOnTop } from "@wailsjs/go/backend/Settings";
import clsx from "clsx";
import useSettings from "@/hooks/useSettings";

const Settings = () => {
  const { data, isLoading } = useSettings();
  return (
    <Card className={clsx("flex h-0 grow p-2", "flex-wrap overflow-y-hidden")}>
      <Checkbox
        disabled={isLoading}
        defaultChecked={data?.AlwaysOnTop}
        onClick={ToggleAlwaysOnTop}
        label="Always On Top"
        crossOrigin={undefined}
      />
    </Card>
  );
};

export default Settings;
