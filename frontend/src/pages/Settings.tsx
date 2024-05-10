import { Button, Checkbox, Input, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { OpenDirectoryDialog, OpenFileDialog } from "@wailsjs/go/backend/App";
import useSettings from "@/hooks/useSettings";

const Settings = () => {
  const { querySettings, setDefaultSavePath, toggleAlwaysOnTop } =
    useSettings();
  const [isFileDialog, setIsFileDialog] = useState<boolean>(
    querySettings.data?.DefaultSavePathIsFile ?? false,
  );

  const handlePath = async () => {
    const path = isFileDialog
      ? await OpenFileDialog()
      : await OpenDirectoryDialog();
    if (path === "") return;
    await setDefaultSavePath({
      DefaultSavePath: path,
      DefaultSavePathIsFile: isFileDialog,
    });
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
        <Typography>Default save directory</Typography>
      </div>

      <div className="col-span-9">
        <Input disabled value={querySettings.data?.DefaultSavePath} />
      </div>

      <Button onClick={() => handlePath()} className="col-span-3 p-2 py-3">
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
    </main>
  );
};

export default Settings;
