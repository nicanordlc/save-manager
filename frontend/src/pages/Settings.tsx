import { Button, Checkbox, Input, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { OpenDialogDirApp, OpenDialogFileApp } from "@wailsjs/go/backend/App";
import useSettings from "@/hooks/useSettings";

const Settings = () => {
  const {
    querySettings,
    setDefaultSavePath,
    toggleAlwaysOnTop,
    setDefaultAppConfigPath,
  } = useSettings();
  const [isFileDialog, setIsFileDialog] = useState<boolean>(
    querySettings.data?.DefaultSavePathIsFile ?? false,
  );

  const handlePath =
    (handlerType: "defaultSave" | "defaultApp") => async () => {
      switch (handlerType) {
        case "defaultSave": {
          const path = isFileDialog
            ? await OpenDialogFileApp(querySettings.data?.DefaultSavePath ?? "")
            : await OpenDialogDirApp(querySettings.data?.DefaultSavePath ?? "");

          if (path === "") break;

          await setDefaultSavePath({
            DefaultSavePath: path,
            DefaultSavePathIsFile: isFileDialog,
          });
          break;
        }
        case "defaultApp": {
          const path = await OpenDialogDirApp(
            querySettings.data?.DefaultAppConfigPath ?? "",
          );

          if (path === "") break;

          await setDefaultAppConfigPath({ DefaultAppConfigPath: path });
          break;
        }
        default:
      }
    };

  return (
    <main className="grid grid-cols-12 items-center gap-2">
      <div className="col-span-full">
        <Checkbox
          className="col-span-2"
          disabled={querySettings.isLoading}
          defaultChecked={querySettings.data?.AlwaysOnTop}
          onClick={() => toggleAlwaysOnTop()}
          label="Always On Top"
          crossOrigin={undefined}
        />
      </div>

      <hr className="col-span-full" />

      <div className="col-span-full">
        <Typography>Save Directory Default Path</Typography>
      </div>

      <div className="col-span-9">
        <Input disabled value={querySettings.data?.DefaultSavePath} />
      </div>

      <Button
        onClick={handlePath("defaultSave")}
        className="col-span-3 p-2 py-3"
      >
        Select
      </Button>

      <div>
        <Checkbox
          checked={isFileDialog}
          onChange={() => setIsFileDialog(!isFileDialog)}
          label="File"
        />
      </div>

      <hr className="col-span-full" />

      <div className="col-span-full">
        <Typography>App Configuration Default Path</Typography>
      </div>

      <div className="col-span-9">
        <Input disabled value={querySettings.data?.DefaultAppConfigPath} />
      </div>

      <Button
        onClick={handlePath("defaultApp")}
        className="col-span-3 p-2 py-3"
      >
        Select
      </Button>
    </main>
  );
};

export default Settings;
