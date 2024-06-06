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
      className="flex items-center justify-between break-all even:bg-blue-gray-50/50 [&>button]:flex [&>button]:justify-center [&>button]:p-3"
      key={props.data.Name}
    >
      <WithTooltip content="Load" placement="top">
        <Button onClick={() => props.onLoad()} variant="text">
          <FaUpload size={15} />
        </Button>
      </WithTooltip>

      <WithTooltip content="Save" placement="top">
        <Button onClick={() => props.onSave()} variant="text">
          <FaDownload size={15} />
        </Button>
      </WithTooltip>

      <Typography className="col-span-5 w-0 grow">{props.data.Name}</Typography>

      <Typography className="col-span-3 px-2 text-center">
        {formatDate(props.data.CreatedAt)}
      </Typography>

      <WithTooltip content="Open" placement="top">
        <Button onClick={() => props.onOpenDirectory()} variant="text">
          <FaFolderOpen size={15} />
        </Button>
      </WithTooltip>

      <WithTooltip content="Delete" placement="top">
        <Button onClick={() => props.onDelete()} variant="text">
          <FaTrash size={15} />
        </Button>
      </WithTooltip>
    </div>
  );
};

export default Save;
