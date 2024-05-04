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
import { LogDebug } from "@wailsjs/runtime/runtime";
import { FaTrash, FaUpload } from "react-icons/fa6";
import useGame, { type GameSingle } from "@/hooks/useGame";
import useMenuMiddleItem from "@/hooks/useMenuMiddleItem";
import LightningSave from "@/components/LightningSave";
import useSave from "@/hooks/useSave";

const DATA_SAVES = [
  {
    id: String(Math.floor(Math.random() * 100)),
    name: "Quick Save",
    updatedAt: "21/21/21",
  },
];

type GameQueryParams = {
  id: string;
};

type FormInputs = {
  Name: string;
};

const Game = () => {
  const { id } = useParams<GameQueryParams>();
  const { addSave } = useSave();
  const { query: queryGame } = useGame<GameSingle>({
    queryKey: "game",
    queryArgs: { ID: id },
  });
  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors: formErrors },
  } = useForm<FormInputs>();

  const handleSave = (name: string, gameID: string) =>
    addSave({ Name: name, GameID: gameID });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    LogDebug("== Form Submit [Save]");
    LogDebug(JSON.stringify(data, null, 2));

    if (id) {
      await handleSave(data.Name, id);
    }

    reset();
    clearErrors();
  };

  const handleLoad = (saveId: string) => {
    LogDebug(`Loading: ${saveId}...`);
  };

  const handleDelete = (saveId: string) => {
    LogDebug(`Delete: ${saveId}`);
  };

  const handleQuickSave = () => {
    LogDebug("...QuickSave");
  };

  const handleQuickLoad = () => {
    LogDebug("...QuickLoad");
  };

  useMenuMiddleItem(
    <LightningSave onSave={handleQuickSave} onLoad={handleQuickLoad} />,
  );
  return (
    <main className="flex grow flex-col">
      <Typography className="mb-4 break-words" variant="h1">
        {queryGame.data?.Name}
      </Typography>

      <Card className="w-full grow border-4 shadow-none">
        <CardHeader
          floated={false}
          shadow={false}
          className="m-4 rounded-none bg-transparent "
          variant="filled"
        >
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Typography color="gray">Manage your saves 👾</Typography>

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
          {DATA_SAVES.map((row) => (
            <div
              className="flex items-center justify-between even:bg-blue-gray-50/50"
              key={row.name}
            >
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleLoad(row.id)}
                  className="p-3"
                  variant="text"
                >
                  <FaUpload size={15} />
                </Button>
                <Typography>{row.name}</Typography>
              </div>

              <Typography>{row.updatedAt}</Typography>

              <Button
                onClick={() => handleDelete(row.id)}
                className="p-3"
                variant="text"
              >
                <FaTrash size={15} />
              </Button>
            </div>
          ))}
        </CardBody>
      </Card>
    </main>
  );
};

export default Game;
