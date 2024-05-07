import { IconButton, Tooltip, Typography } from "@material-tailwind/react";
import { FaBoltLightning, FaDownload, FaUpload } from "react-icons/fa6";

type LightningSaveProps = {
  onSave: () => void;
  onLoad: () => void;
};

const LightningSave = (props: LightningSaveProps) => {
  const getTooltipContent = (text: string) => (
    <Typography className="text-black" variant="small">
      {text}
    </Typography>
  );

  return (
    <div className="relative flex flex-col items-center gap-1">
      <Tooltip
        content={getTooltipContent("Save")}
        placement="right"
        className="border border-blue-gray-50 bg-white shadow-xl shadow-black/10"
      >
        <IconButton
          onClick={() => props.onSave()}
          className="top-1 bg-green-700 "
          size="md"
        >
          <FaDownload />
        </IconButton>
      </Tooltip>

      <Tooltip
        content={getTooltipContent("Quick Save/Load")}
        placement="right"
        className="border border-blue-gray-50 bg-white shadow-xl shadow-black/10"
      >
        <div className="pb-1 pt-1">
          <IconButton
            className="hover:cursor-default active:!opacity-100"
            ripple={false}
          >
            <FaBoltLightning />
          </IconButton>
        </div>
      </Tooltip>

      <Tooltip
        content={getTooltipContent("Load")}
        placement="right"
        className="border border-blue-gray-50 bg-white shadow-xl shadow-black/10"
      >
        <IconButton
          onClick={() => {
            props.onLoad();
          }}
          className="bottom-1 bg-red-700 "
          size="md"
        >
          <FaUpload />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default LightningSave;
