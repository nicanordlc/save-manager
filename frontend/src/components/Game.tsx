import {
  Badge,
  Button,
  Card,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useRef, useState, type FC } from "react";
import Marquee from "react-fast-marquee";
import { FaX } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { type GameSingle } from "@/hooks/useGame";

type GameProps = Pick<GameSingle, "ID" | "Name"> & {
  remove: () => void;
};

const Game: FC<GameProps> = (props) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const typographyRef = useRef<HTMLElement>(null);
  const [shouldMarquee, setShouldMarquee] = useState<boolean>(false);

  useEffect(() => {
    const headerWidth = headerRef.current?.clientWidth ?? 0;
    const typographyWidth = typographyRef.current?.clientWidth ?? 0;
    setShouldMarquee(typographyWidth > headerWidth);
  }, []);

  const marquee = (title: string) => {
    const content = (
      <Typography
        ref={typographyRef}
        className="inline-block px-2"
        variant="h6"
      >
        {title}
      </Typography>
    );
    return shouldMarquee ? <Marquee speed={25}>{content}</Marquee> : content;
  };

  return (
    <li>
      <Badge
        color="orange"
        className="m-0 p-0"
        placement="bottom-end"
        content={
          <Button className="bg-transparent p-[6px]" onClick={props.remove}>
            <FaX size={10} />
          </Button>
        }
      >
        <Card className="w-60 border-4 shadow-none">
          <Link to={`/game/${props.ID}`}>
            <CardHeader
              floated={false}
              shadow={false}
              ref={headerRef}
              className="m-2 rounded-lg"
            >
              {marquee(props.Name)}
            </CardHeader>
          </Link>
        </Card>
      </Badge>
    </li>
  );
};

export default Game;
