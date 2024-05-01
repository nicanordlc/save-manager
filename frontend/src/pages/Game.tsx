import { Card, Typography } from "@material-tailwind/react";
import { useParams } from "react-router-dom";

type GameParams = {
  id: string;
};

const Game = () => {
  const { id } = useParams<GameParams>();

  return (
    <Card className="h-0 grow overflow-y-auto p-2" color="indigo">
      <Typography variant="h1">{id}</Typography>
    </Card>
  );
};

export default Game;
