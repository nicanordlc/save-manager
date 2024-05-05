import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { FaPlus, FaX } from "react-icons/fa6";
import { FaDirections } from "react-icons/fa";
import clsx from "clsx";
import { OpenDirectoryDialog } from "@wailsjs/go/backend/App";
import { useNavigate } from "react-router-dom";
import useGame, { type GameSingle } from "@/hooks/useGame";

type FormInputs = Pick<GameSingle, "Name" | "SavePath">;

const AddGame = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    setFocus,
    formState: { errors: formErrors },
  } = useForm<FormInputs>();
  const navigate = useNavigate();
  const { addGame } = useGame();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const gameID = (await addGame({
      Name: data.Name,
      SavePath: data.SavePath,
    })) as string;

    navigate(`/game/${gameID}`);
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
    if (!isDialogOpen) {
      setTimeout(() => {
        setFocus("Name");
      }, 400);
    }
    reset();
  };

  const handlePath = async () => {
    const path = await OpenDirectoryDialog();
    if (path === "") return;
    setValue("SavePath", path);
    clearErrors("SavePath");
    setFocus("Name");
  };

  const tooltipContent = (
    <Typography className="text-black" variant="small">
      Add Game
    </Typography>
  );

  return (
    <>
      <Tooltip
        content={tooltipContent}
        placement="right"
        className="border border-blue-gray-50 bg-white shadow-xl shadow-black/10"
      >
        <IconButton onClick={toggleDialog} data-testid="addGameSave">
          <FaPlus />
        </IconButton>
      </Tooltip>

      <Dialog open={isDialogOpen} handler={toggleDialog}>
        <div className="flex items-center justify-between">
          <DialogHeader className="flex flex-col items-start">
            <Typography className="mb-1" variant="h4">
              New Game
            </Typography>
          </DialogHeader>

          <IconButton variant="text" onClick={toggleDialog}>
            <FaX />
          </IconButton>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody>
            <Typography className="-mt-7 mb-10 " color="gray" variant="lead">
              Be Ready To Manage Your Saves 💾
            </Typography>

            <div className="grid gap-6">
              <Typography className="-mb-1" color="blue-gray" variant="h6">
                Game Name
              </Typography>

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

              <Button
                onClick={handlePath}
                className={clsx("flex items-center justify-center", {
                  "bg-red-300": formErrors.SavePath,
                })}
              >
                PATH
                <FaDirections className="ml-2" />
              </Button>
              <input
                className="hidden"
                {...register("SavePath", { required: true })}
              />
            </div>
          </DialogBody>

          <DialogFooter className="space-x-2">
            <Button variant="text" color="gray" onClick={toggleDialog}>
              cancel
            </Button>

            <Button type="submit" variant="gradient" color="gray">
              Create Game
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
};

export default AddGame;
