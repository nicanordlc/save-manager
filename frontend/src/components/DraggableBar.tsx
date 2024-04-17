import clsx from "clsx";

const DraggableBar = () => {
  const style = { "--wails-draggable": "drag" } as React.CSSProperties;

  return (
    <div
      draggable={false}
      className={clsx("border-4 border-blue-500 text-center", "no-select")}
      style={style}
    >
      •••
    </div>
  );
};

export default DraggableBar;
