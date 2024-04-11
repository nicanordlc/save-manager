// @FIXME: set prettier, configure props corectly (props)

type LayoutProps = {
  children: any;
  id: any;
};

const Layout = (props: LayoutProps) => {
  return <div className="bg-white">{props.children}</div>;
};

export default Layout;
