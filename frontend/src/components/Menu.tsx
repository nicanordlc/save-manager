import {
  faHamburger,
  faPlusCircle,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@material-tailwind/react";
import clsx from "clsx";
import { type FC } from "react";
import { Link } from "react-router-dom";

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
            <FontAwesomeIcon icon={faHamburger} />
          </IconButton>
        </Link>
      </li>

      <li>
        <Link to="/">
          <IconButton>
            <FontAwesomeIcon icon={faPlusCircle} />
          </IconButton>
        </Link>
      </li>

      <li>
        <Link to="/settings">
          <IconButton>
            <FontAwesomeIcon icon={faWrench} />
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
