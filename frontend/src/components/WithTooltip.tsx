import { Tooltip, Typography } from "@material-tailwind/react";
import { type ReactElement } from "react";

type WithTooltipProps = {
  children: ReactElement;
  content: string;
  placement: string;
};

const WithTooltip = (props: WithTooltipProps) => {
  return (
    <Tooltip
      content={
        <Typography className="text-black" variant="small">
          {props.content}
        </Typography>
      }
      placement={props.placement}
      className="border border-blue-gray-50 bg-white shadow-xl shadow-black/10"
    >
      {props.children}
    </Tooltip>
  );
};

export default WithTooltip;
