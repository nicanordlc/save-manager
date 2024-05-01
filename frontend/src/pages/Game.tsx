import { Card, Typography } from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import useGame, { type GameSingle } from "@/hooks/useGame";

type GameParams = {
  id: string;
};

const Game = () => {
  const { id } = useParams<GameParams>();
  const { query: queryGame } = useGame<GameSingle>({
    queryKey: "game",
    queryArgs: { ID: id },
  });

  return (
    <Card className="h-0 grow overflow-y-auto p-2" color="indigo">
      <Typography variant="h1">{queryGame.data?.ID}</Typography>
      <Typography variant="paragraph">{queryGame.data?.Name}</Typography>
      <Typography variant="paragraph">{queryGame.data?.SavePath}</Typography>
    </Card>
  );
};

export default Game;
