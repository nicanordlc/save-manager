import clsx from "clsx";
import { type ReactHTML, type FC } from "react";

type LayoutProps = {
  container?: keyof ReactHTML;
  className?: string;
  children?: React.ReactNode;
};

const Layout: FC<LayoutProps> = (props) => {
  const Container = props.container ?? "div";

  return (
    <Container
      data-testid="layout"
      className={clsx("min-h-screen bg-yellow-800 text-white", props.className)}
    >
      {props.children}
    </Container>
  );
};

Layout.defaultProps = {
  container: "div",
  className: "asdf",
  children: null,
};

export default Layout;
