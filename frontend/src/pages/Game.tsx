/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import { type SubmitHandler, useForm } from "react-hook-form";
import clsx from "clsx";
import { FaFolderOpen, FaTrash, FaUpload } from "react-icons/fa6";
import { OpenSaveDir } from "@wailsjs/go/backend/Save";
import { OpenGameDir } from "@wailsjs/go/backend/Game";
import useGame, { type GameSingle } from "@/hooks/useGame";
import useMenuMiddleItem from "@/hooks/useMenuMiddleItem";
import LightningSave from "@/components/LightningSave";
import useSave from "@/hooks/useSave";

type GameQueryParams = {
  id: string;
};

type FormInputs = {
  Name: string;
};

const Game = () => {
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
  } = useSave({
    GameID: gameID,
  });
  const { query: queryGame } = useGame<GameSingle>({
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

  const handleLoad = (saveId: string) =>
    loadSave({ ID: saveId, GameID: gameID });

  const handleDelete = (saveID: string) =>
    removeSave({ ID: saveID, GameID: gameID });

  const handleOpenSaveDirectory = (saveID: string) =>
    OpenSaveDir(saveID, gameID);

  const handleOpenGameDirectory = () => OpenGameDir(gameID);

  const handleQuickSave = () => addQuickSave({ GameID: gameID });

  const handleQuickLoad = () => loadQuickSave({ GameID: gameID });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const intlDate = new Intl.DateTimeFormat("en-US").format(date);
    return intlDate;
  };

  const getQuickSaveChip = () => (
    <Chip
      className={clsx({
        "[&>button]:pointer-events-none [&>button]:opacity-50":
          !quickSaveEnabled,
      })}
      variant="ghost"
      color={quickSaveEnabled ? "green" : "red"}
      size="sm"
      value="Quick Save"
      onClose={() => removeQuickSave({ GameID: gameID })}
      icon={
        <span
          className={clsx(
            "mx-auto mt-1 block h-2 w-2 rounded-full content-['']",
            {
              "bg-red-900": !quickSaveEnabled,
              "bg-green-900": quickSaveEnabled,
            },
          )}
        />
      }
    />
  );

  useMenuMiddleItem(
    <LightningSave onSave={handleQuickSave} onLoad={handleQuickLoad} />,
  );

  return (
    <main className="flex grow flex-col">
      <Typography className="break-words" variant="h1">
        {queryGame.data?.Name ?? ""}
      </Typography>

      <div className="mb-2 rounded-full border-4">
        <Button
          onClick={() => handleOpenGameDirectory()}
          className="rounded-bl-[20px] rounded-tl-[20px] p-3"
          variant="text"
        >
          <FaFolderOpen size={15} />
        </Button>
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
              {getQuickSaveChip()}
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
              <div
                className="grid grid-cols-12 items-center justify-between break-all even:bg-blue-gray-50/50"
                key={save.Name}
              >
                <div className="col-span-7 flex items-center gap-2">
                  <Button
                    onClick={() => handleLoad(save.ID)}
                    className="p-3"
                    variant="text"
                  >
                    <FaUpload size={15} />
                  </Button>
                  <Typography>{save.Name}</Typography>
                </div>

                <Typography className="col-span-3 px-2">
                  {formatDate(save.CreatedAt)}
                </Typography>

                <Button
                  onClick={() => handleOpenSaveDirectory(save.ID)}
                  className="p-3"
                  variant="text"
                >
                  <FaFolderOpen size={15} />
                </Button>

                <Button
                  onClick={() => handleDelete(save.ID)}
                  className="p-3"
                  variant="text"
                >
                  <FaTrash size={15} />
                </Button>
              </div>
            ))
          )}
        </CardBody>
      </Card>
    </main>
  );
};

export default Game;
