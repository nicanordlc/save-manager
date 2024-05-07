import clsx from "clsx";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { FaBell } from "react-icons/fa6";
import useMenuMiddleItem from "@/hooks/useMenuMiddleItem";
import AddGame from "@/components/AddGame";
import useGame, { type Game as TGame } from "@/hooks/useGame";
import Game from "@/components/Game";
import NoGame from "@/components/NoGame";

const Saves = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogGameName, setDialogGameName] = useState<string>("");
  const [dialogGameID, setDialogGameID] = useState<string>("");
  useMenuMiddleItem(<AddGame />);
  const { queryGame, removeGame } = useGame<TGame>({
    queryKey: "games",
  });

  const jsonData = queryGame.data?.Data;
  const hasGame = Array.isArray(jsonData) ? jsonData.length : jsonData;

  if (!hasGame) {
    return <NoGame />;
  }

  const toggleDialog = (name: string, id: string) => {
    setDialogGameName(name);
    setDialogGameID(id);
    setIsDialogOpen(!isDialogOpen);
  };

  const cancelDialog = () => {
    toggleDialog("", "");
  };

  const acceptDialog = async () => {
    await removeGame({ ID: dialogGameID });
    toggleDialog("", "");
  };

  return (
    <>
      <ul className={clsx("mb-4", "flex flex-wrap justify-around gap-3")}>
        {queryGame.data?.Data?.map(({ Name, ID }) => {
          return (
            <Game
              key={`game-${Math.random()}`}
              Name={Name}
              ID={ID}
              remove={() => toggleDialog(Name, ID)}
            />
          );
        })}
      </ul>

      <Dialog open={isDialogOpen} handler={() => toggleDialog("", "")}>
        <DialogHeader>
          <Typography variant="h5" color="blue-gray">
            Danger Zone!
          </Typography>
        </DialogHeader>

        <DialogBody divider className="grid place-items-center gap-4">
          <FaBell size={55} className="text-red-500" />

          <Typography color="red" variant="h4">
            You should read this!
          </Typography>

          <Typography className="text-center font-normal">
            Are you sure you want to remove <b>{dialogGameName}</b> ?
          </Typography>
        </DialogBody>

        <DialogFooter className="space-x-2">
          <Button
            onClick={() => cancelDialog()}
            variant="text"
            color="blue-gray"
          >
            Cancel
          </Button>
          <Button onClick={() => acceptDialog()} variant="gradient">
            YES, YES!
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default Saves;
