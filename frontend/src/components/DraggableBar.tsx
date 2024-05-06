import { ToggleFullScreen } from "@wailsjs/go/backend/App";
import clsx from "clsx";
import { type FC } from "react";

type DraggableBarProps = {
  height: number;
  className?: string;
};

const DraggableBar: FC<DraggableBarProps> = (props) => {
  const style = { "--wails-draggable": "drag" } as React.CSSProperties;

  return (
    <div
      onDoubleClick={ToggleFullScreen}
      draggable={false}
      className={clsx(
        "no-select fixed left-0 right-0 top-0 z-10 flex items-center justify-center",
        {
          hidden: props.height < 1,
        },
        props.className,
      )}
      style={{
        ...style,
        height: props.height,
      }}
    >
      •••
    </div>
  );
};

DraggableBar.defaultProps = {
  className: "",
};

export default DraggableBar;
