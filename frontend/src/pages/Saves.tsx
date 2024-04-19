import { Button } from "@material-tailwind/react";
import clsx from "clsx";
import Game from "@/components/Game";

const Saves = () => {
  return (
    <main>
      <ul className={clsx("mb-4", "flex flex-wrap justify-around gap-2")}>
        <Game />
        <Game />
        <Game />
        <Game />
        <Game />
        <Game />
        <Game />
        <Game />
        <Game />
        <Game />
        <Game />
        <Game />
        <Game />
      </ul>

      <Button fullWidth>Add Game</Button>
    </main>
  );
};

export default Saves;
