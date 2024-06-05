import { Button, Typography } from "@material-tailwind/react";
import { FaDownload, FaFolderOpen, FaTrash, FaUpload } from "react-icons/fa6";
import { type SaveSingle } from "@/hooks/useSave";
import WithTooltip from "@/components/WithTooltip";

type SavePropsCallback = () => Promise<void> | void;

type SaveProps = {
  data: SaveSingle;
  onLoad: SavePropsCallback;
  onSave: SavePropsCallback;
  onDelete: SavePropsCallback;
  onOpenDirectory: SavePropsCallback;
};

const Save = (props: SaveProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const intlDate = new Intl.DateTimeFormat("en-US").format(date);
    return intlDate;
  };

  return (
    <div
      className="grid grid-cols-12 items-center justify-between break-all even:bg-blue-gray-50/50"
      key={props.data.Name}
    >
      <div className="col-span-7 flex items-center gap-2">
        <div>
          <WithTooltip content="Load" placement="top">
            <Button
              onClick={() => props.onLoad()}
              className="p-3"
              variant="text"
            >
              <FaUpload size={15} />
            </Button>
          </WithTooltip>

          <WithTooltip content="Save" placement="top">
            <Button
              onClick={() => props.onSave()}
              className="p-3"
              variant="text"
            >
              <FaDownload size={15} />
            </Button>
          </WithTooltip>
        </div>

        <Typography>{props.data.Name}</Typography>
      </div>

      <Typography className="col-span-3 px-2">
        {formatDate(props.data.CreatedAt)}
      </Typography>

      <WithTooltip content="Open" placement="top">
        <Button
          onClick={() => props.onOpenDirectory()}
          className="p-3"
          variant="text"
        >
          <FaFolderOpen size={15} />
        </Button>
      </WithTooltip>

      <WithTooltip content="Delete" placement="top">
        <Button onClick={() => props.onDelete()} className="p-3" variant="text">
          <FaTrash size={15} />
        </Button>
      </WithTooltip>
    </div>
  );
};

export default Save;
