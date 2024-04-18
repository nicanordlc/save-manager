import clsx from "clsx";

const DraggableBar = () => {
  const style = { "--wails-draggable": "drag" } as React.CSSProperties;

  return (
    <div
      draggable={false}
      className={clsx("flex h-7 items-center justify-center", "no-select")}
      style={style}
    >
      •••
    </div>
  );
};

export default DraggableBar;
