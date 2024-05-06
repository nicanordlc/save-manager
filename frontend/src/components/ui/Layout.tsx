import clsx from "clsx";
import { type ReactHTML, type FC } from "react";
import { Card } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { GetOS } from "@wailsjs/go/backend/App";
import DraggableBar from "@/components/DraggableBar";
import Menu from "@/components/Menu";

type LayoutProps = {
  container?: keyof ReactHTML;
  className?: string;
  children?: React.ReactNode;
};

const Layout: FC<LayoutProps> = (props) => {
  const { data } = useQuery({
    queryKey: ["app"],
    queryFn: GetOS,
  });

  const isMac = data === "darwin";
  const Container = props.container ?? "div";
  const menuWidth = 60;
  const dragBarHeight = isMac ? 28 : 0;

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
        <Card className="h-0 grow overflow-y-auto p-2 ">{props.children}</Card>
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
