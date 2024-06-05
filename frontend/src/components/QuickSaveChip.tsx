import { Button, Chip } from "@material-tailwind/react";
import clsx from "clsx";
import { FaFolderOpen } from "react-icons/fa6";
import WithTooltip from "@/components/WithTooltip";

type QuickSaveChipProps = {
  enabled: boolean;
  onClose: () => void;
  onOpen: () => void;
};

const QuickSaveChip = (props: QuickSaveChipProps) => {
  return (
    <div className="flex gap-4">
      <Chip
        className={clsx({
          "[&_button]:pointer-events-none [&_button]:opacity-50":
            !props.enabled,
        })}
        variant="ghost"
        color={props.enabled ? "green" : "red"}
        size="sm"
        value={
          <div className="flex items-center gap-2">
            <span>Quick Save</span>

            <WithTooltip content="Open" placement="top">
              <Button
                onClick={() => props.onOpen()}
                className="p-0.5"
                variant="text"
              >
                <FaFolderOpen size={12} />
              </Button>
            </WithTooltip>
          </div>
        }
        onClose={() => props.onClose()}
        icon={
          <span
            className={clsx(
              "mx-auto mt-1 block h-2 w-2 rounded-full content-['']",
              {
                "bg-red-900": !props.enabled,
                "bg-green-900": props.enabled,
              },
            )}
          />
        }
      />
    </div>
  );
};

export default QuickSaveChip;
