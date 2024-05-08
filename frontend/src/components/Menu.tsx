import { IconButton, Tooltip, Typography } from "@material-tailwind/react";
import clsx from "clsx";
import { type FC } from "react";
import { Link } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
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
          <Tooltip
            content={
              <Typography className="text-black" variant="small">
                Saves
              </Typography>
            }
            placement="right"
            className="border border-blue-gray-50 bg-white shadow-xl shadow-black/10"
          >
            <IconButton>
              <FaSave />
            </IconButton>
          </Tooltip>
        </Link>
      </li>

      <li>
        <MenuMiddleItem />
      </li>

      <li>
        <Link to="/settings">
          <Tooltip
            content={
              <Typography className="text-black" variant="small">
                Settings
              </Typography>
            }
            placement="right"
            className="border border-blue-gray-50 bg-white shadow-xl shadow-black/10"
          >
            <IconButton>
              <FaGear />
            </IconButton>
          </Tooltip>
        </Link>
      </li>
    </menu>
  );
};

Menu.defaultProps = {
  className: "",
};

export default Menu;
