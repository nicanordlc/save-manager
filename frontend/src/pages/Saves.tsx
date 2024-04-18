import { Link } from "react-router-dom";
import Game from "@/components/Game";

const Saves = () => {
  const mockGames = [
    {
      label: "Game 1",
      id: 1,
    },
    {
      label: "Game 2",
      id: 2,
    },
    {
      label: "Game 3",
      id: 3,
    },
    {
      label: "Game 4",
      id: 4,
    },
  ];

  return (
    <main>
      <ul className="mb-4 grid grid-cols-2 gap-4">
        {mockGames.map((game) => (
          <Game
            key={`game-${game.label.toLocaleLowerCase().replace(/\s/g, "-")}`}
            label={game.label}
            id={game.id}
          />
        ))}
      </ul>

      <Link to="/" className="rounded-md border p-2" type="button">
        Add Game
      </Link>
    </main>
  );
};

export default Saves;
