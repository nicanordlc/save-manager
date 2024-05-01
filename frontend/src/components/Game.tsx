import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useRef, useState, type FC } from "react";
import Marquee from "react-fast-marquee";
import { FaX } from "react-icons/fa6";

type GameProps = {
  title: string;
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

  const getHeader = (title: string) => {
    const content = (
      <Typography ref={typographyRef} className="px-2" variant="h6">
        {title}
      </Typography>
    );
    return shouldMarquee ? <Marquee>{content}</Marquee> : content;
  };

  const getBadgeContent = () => {
    return (
      <Button className="bg-transparent p-0" onClick={props.remove}>
        <FaX size={10} />
      </Button>
    );
  };

  return (
    <li>
      <Card className="mt-4 w-60">
        <CardHeader
          ref={headerRef}
          className="-mt-3 mb-0 grid h-8 place-items-center"
        >
          {getHeader(props.title)}
        </CardHeader>

        <Badge placement="bottom-end" content={getBadgeContent()}>
          <CardBody className="p-2">
            <Typography color="blue-gray" className="mb-2">
              Status bar
            </Typography>
          </CardBody>
        </Badge>
      </Card>
    </li>
  );
};

export default Game;
