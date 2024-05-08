import { IconButton, Tooltip, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import DialogGameForm from "@/components/DialogGameForm";
import useGame from "@/hooks/useGame";

const AddGame = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { addGame } = useGame();

  return (
    <>
      <Tooltip
        content={
          <Typography className="text-black" variant="small">
            Add Game
          </Typography>
        }
        placement="right"
        className="border border-blue-gray-50 bg-white shadow-xl shadow-black/10"
      >
        <IconButton
          onClick={() => setDialogOpen(!dialogOpen)}
          data-testid="addGameSave"
        >
          <FaPlus />
        </IconButton>
      </Tooltip>
      <DialogGameForm
        open={dialogOpen}
        handler={setDialogOpen}
        title="New Game"
        bodyTitle="Be Ready To Manage Your Saves 💾"
        required={{ Name: true, SavePath: true }}
        submit={async (data) => {
          const gameID = (await addGame({
            Name: data.Name,
            SavePath: data.SavePath,
          })) as string;
          navigate(`/game/${gameID}`);
        }}
      />
    </>
  );
};

export default AddGame;
