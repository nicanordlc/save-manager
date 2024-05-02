import clsx from "clsx";
import { type ReactHTML, type FC } from "react";
import { Card } from "@material-tailwind/react";
import DraggableBar from "@/components/DraggableBar";
import Menu from "@/components/Menu";

type LayoutProps = {
  container?: keyof ReactHTML;
  className?: string;
  children?: React.ReactNode;
};

const Layout: FC<LayoutProps> = (props) => {
  const Container = props.container ?? "div";
  const menuWidth = 60;
  const dragBarHeight = 28;

  return (
    <Container
      data-testid="layout"
      className={clsx("bg-main-300 text-white", props.className)}
    >
      <DraggableBar className="bg-main-100" height={dragBarHeight} />

      <Menu
        className="bg-main-200"
        width={menuWidth}
        height={`calc(100% - ${dragBarHeight}px)`}
      />

      <div
        className="flex flex-col p-2"
        style={{
          marginTop: dragBarHeight,
          marginLeft: menuWidth,
          minHeight: `calc(100vh - ${dragBarHeight}px)`,
        }}
      >
        <Card className="h-0 grow overflow-y-auto p-2 ">
          {/* <Card className="flex h-0 grow flex-wrap overflow-y-hidden p-2"> */}
          {/* <Card className="h-0 grow overflow-y-auto p-2"> */}
          {props.children}
        </Card>
      </div>
    </Container>
  );
};

Layout.defaultProps = {
  container: "div",
  className: "",
  children: null,
};

export default Layout;
