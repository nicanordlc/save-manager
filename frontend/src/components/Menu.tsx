import { IconButton } from "@material-tailwind/react";
import clsx from "clsx";
import { type FC } from "react";
import { Link } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import { FaHamburger } from "react-icons/fa";
import MenuMiddleItem from "@/components/MenuMiddleItem";

type MenuProps = {
  width: number;
  height: string | number;
  className?: string;
};

const Menu: FC<MenuProps> = (props) => {
  return (
    <menu
      style={{ width: props.width, height: props.height }}
      className={clsx(
        "fixed flex flex-col items-center justify-between py-2",
        props.className,
      )}
    >
      <li>
        <Link to="/">
          <IconButton>
            <FaHamburger />
          </IconButton>
        </Link>
      </li>

      <li>
        <MenuMiddleItem />
      </li>

      <li>
        <Link to="/settings">
          <IconButton>
            <FaGear />
          </IconButton>
        </Link>
      </li>
    </menu>
  );
};

Menu.defaultProps = {
  className: "",
};

export default Menu;
