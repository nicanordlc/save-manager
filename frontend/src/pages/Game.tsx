/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import { type SubmitHandler, useForm } from "react-hook-form";
import clsx from "clsx";
import { FaFolderOpen, FaPencil } from "react-icons/fa6";
import { OpenQuickSaveDir, OpenSaveDir } from "@wailsjs/go/backend/Save";
import { toast } from "react-toastify";
import { useCallback, useState } from "react";
import { BrowseGameDir } from "@wailsjs/go/backend/Game";
import useGame, { type GameSingle } from "@/hooks/useGame";
import useMenuMiddleItem from "@/hooks/useMenuMiddleItem";
import LightningSave from "@/components/LightningSave";
import useSave from "@/hooks/useSave";
import useEvents from "@/hooks/useEvents";
import DialogGameForm from "@/components/DialogGameForm";
import Save from "@/components/Save";
import WithTooltip from "@/components/WithTooltip";
import QuickSaveChip from "@/components/QuickSaveChip";

type GameQueryParams = {
  id: string;
};

type FormInputs = {
  Name: string;
};

const Game = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { id: gameID = "" } = useParams<GameQueryParams>();
  const {
    querySaves,
    queryQuickSave,
    addSave,
    removeSave,
    addQuickSave,
    removeQuickSave,
    loadSave,
    loadQuickSave,
    overwriteSave,
  } = useSave({
    GameID: gameID,
  });
  const { queryGame, updateGame, invalidateGamesQuery } = useGame<GameSingle>({
    queryKey: "game",
    queryArgs: { ID: gameID },
  });
  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors: formErrors },
  } = useForm<FormInputs>();
  const quickSaveEnabled = queryQuickSave.data;

  const handleSave = (name: string) => addSave({ Name: name, GameID: gameID });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    await handleSave(data.Name);

    reset();
    clearErrors();
  };

  const handleLoad = async (saveId: string) => {
    await loadSave({ ID: saveId, GameID: gameID });
    toast.info("Loaded");
  };

  const handleOverwrite = async (saveID: string) => {
    await overwriteSave({ ID: saveID, GameID: gameID });
    toast.info("Saved");
  };

  const handleDelete = (saveID: string) =>
    removeSave({ ID: saveID, GameID: gameID });

  const handleOpenSaveDirectory = (saveID: string) =>
    OpenSaveDir(saveID, gameID);

  const handleOpenGameDirectory = () => BrowseGameDir(gameID);

  const handleQuickSave = useCallback(async () => {
    await addQuickSave({ GameID: gameID });
    toast.info("Saved");
  }, [addQuickSave, gameID]);

  const handleQuickLoad = useCallback(async () => {
    await loadQuickSave({ GameID: gameID });
    toast.info("Loaded");
  }, [loadQuickSave, gameID]);

  const handleOpenQuickSaveDirectory = () => OpenQuickSaveDir(gameID);

  useEvents({ type: "quickSave", cb: handleQuickSave });
  useEvents({ type: "quickLoad", cb: handleQuickLoad });

  useMenuMiddleItem(
    <LightningSave onSave={handleQuickSave} onLoad={handleQuickLoad} />,
  );

  return (
    <main className="flex grow flex-col">
      <Typography className="break-words" variant="h1">
        {queryGame.data?.Name ?? ""}
      </Typography>

      <div className="mb-2 rounded-full border-4">
        <WithTooltip content="Open" placement="top">
          <Button
            onClick={() => handleOpenGameDirectory()}
            className="rounded-bl-[20px] rounded-tl-[20px] p-3"
            variant="text"
          >
            <FaFolderOpen size={15} />
          </Button>
        </WithTooltip>

        <WithTooltip content="Edit" placement="top">
          <Button
            onClick={async () => {
              await invalidateGamesQuery();
              setDialogOpen(true);
            }}
            className="p-3"
            variant="text"
          >
            <FaPencil size={15} />
          </Button>
        </WithTooltip>
      </div>

      <Card className="w-full grow border-4 shadow-none">
        <CardHeader
          floated={false}
          shadow={false}
          className="m-4 rounded-none bg-transparent "
          variant="filled"
        >
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-between">
              <Typography color="gray">Manage your saves 👾</Typography>
              <QuickSaveChip
                enabled={quickSaveEnabled ?? false}
                onClose={() => removeQuickSave({ GameID: gameID })}
                onOpen={() => handleOpenQuickSaveDirectory()}
              />
            </div>

            <Input
              labelProps={{
                className: "hidden",
              }}
              placeholder="name"
              className={clsx(
                "!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10",
                {
                  "!border-red-300 focus:!border-red-900 focus:!border-t-red-900 focus:!ring-red-900/10":
                    formErrors.Name,
                },
              )}
              label="name"
              {...register("Name", { required: true })}
            />

            <Button type="submit" variant="gradient" color="gray">
              Create Save
            </Button>
          </form>
        </CardHeader>

        <CardBody className="h-0 grow overflow-y-auto border-t-4 p-4">
          {(querySaves.data?.length ?? 0) < 1 ? (
            <div />
          ) : (
            querySaves.data?.map((save) => (
              <Save
                key={save.ID}
                data={save}
                onLoad={() => handleLoad(save.ID)}
                onSave={() => handleOverwrite(save.ID)}
                onDelete={() => handleDelete(save.ID)}
                onOpenDirectory={() => handleOpenSaveDirectory(save.ID)}
              />
            ))
          )}
        </CardBody>
      </Card>

      <DialogGameForm
        open={dialogOpen}
        handler={setDialogOpen}
        title="Edit Game"
        defaultValues={{
          formInputs: {
            Name: queryGame.data?.Name,
            SavePath: queryGame.data?.SavePath,
            SavePathIsFile: queryGame.data?.SavePathIsFile,
          },
          gameID,
        }}
        submit={async (data) => {
          await updateGame({
            ID: gameID,
            Name: data.Name,
            SavePath: data.SavePath,
            SavePathIsFile: data.SavePathIsFile,
          });
          setDialogOpen(false);
        }}
      />
    </main>
  );
};

export default Game;
