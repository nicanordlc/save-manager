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
    <div className="group relative flex flex-col items-center gap-1">
      <Tooltip
        content={getTooltipContent("Save")}
        placement="right"
        className="border border-blue-gray-50 bg-white shadow-xl shadow-black/10"
      >
        <IconButton
          onClick={() => props.onSave()}
          className="!absolute top-1 -z-10 bg-green-700 group-hover:group-first:top-0 group-hover:group-first:-translate-y-full"
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
          className="!absolute bottom-1 -z-10 bg-red-700 group-hover:group-last:bottom-0 group-hover:group-last:translate-y-full"
          size="md"
        >
          <FaUpload />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default LightningSave;
