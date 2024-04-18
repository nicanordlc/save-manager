import { type FC } from "react";
import { Link } from "react-router-dom";

type GameProps = {
  label: string;
  id: number | string;
};

const Game: FC<GameProps> = (props) => {
  return (
    <div className="rounded-md border p-2">
      <Link to={`/game/${props.id}`}> {props.label}</Link>
    </div>
  );
};

export default Game;
