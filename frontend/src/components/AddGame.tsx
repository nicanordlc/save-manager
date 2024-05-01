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
import { useNavigate } from "react-router-dom";
import useGame from "@/hooks/useGame";

type FormInputs = {
  name: string;
  path: string;
};

const AddGame = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { register, handleSubmit, reset } = useForm<FormInputs>();
  const navigate = useNavigate();
  const { addGame } = useGame();

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
    reset();
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const gameID = (await addGame({
      Name: data.name,
      SavePath: data.path,
    })) as string;

    navigate(`/game/${gameID}`);
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
                label="name"
                required
                {...register("name", { required: true })}
              />

              <Input
                label="save path"
                required
                {...register("path", { required: true })}
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
