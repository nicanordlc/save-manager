import clsx from "clsx";
import { type ReactHTML, type FC } from "react";
import DraggableBar from "@/components/DraggableBar";
import Menu from "@/components/Menu";

type LayoutProps = {
  container?: keyof ReactHTML;
  className?: string;
  children?: React.ReactNode;
};

const Layout: FC<LayoutProps> = (props) => {
  const Container = props.container ?? "div";
  const menuWidth = 80;
  const dragBarHeight = 28;

  return (
    <Container
      data-testid="layout"
      className={clsx("bg-c-sh-300 text-white", props.className)}
    >
      <DraggableBar className="bg-c-sh-100" height={dragBarHeight} />

      <Menu
        className="bg-c-sh-200"
        width={menuWidth}
        height={`calc(100% - ${dragBarHeight}px)`}
      />

      <div
        className="p-2"
        style={{
          marginTop: dragBarHeight,
          marginLeft: menuWidth,
          minHeight: `calc(100vh - ${dragBarHeight}px)`,
        }}
      >
        {props.children}
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
