import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useRef, useState, type FC } from "react";
import Marquee from "react-fast-marquee";

type GameProps = {
  title: string;
};

const Game: FC<GameProps> = (props) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const typographyRef = useRef<HTMLElement>(null);
  const [shouldMarquee, setShouldMarquee] = useState<boolean>(false);

  useEffect(() => {
    const headerHeight = headerRef.current?.clientHeight ?? 0;
    const typographyHeight = typographyRef.current?.clientHeight ?? 0;
    setShouldMarquee(typographyHeight > headerHeight);
  }, []);

  const getHeader = (title: string) => {
    const content = (
      <Typography ref={typographyRef} className="px-2" variant="h6">
        {title}
      </Typography>
    );
    return shouldMarquee ? <Marquee>{content}</Marquee> : content;
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

        <CardBody className="p-2">
          <Typography color="blue-gray" className="mb-2">
            Status bar
          </Typography>
        </CardBody>
      </Card>
    </li>
  );
};

export default Game;
