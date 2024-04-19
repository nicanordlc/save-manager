import {
  Card,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";

const Game = () => {
  return (
    <li>
      <Card className="size-40">
        <CardBody className="p-2">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            Hello
          </Typography>
        </CardBody>
        <CardFooter className="p-2 pt-0">
          <Typography>a</Typography>
        </CardFooter>
      </Card>
    </li>
  );
};

export default Game;
