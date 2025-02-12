import { Link } from "react-router-dom"
import LogoutBtn from "../Auth/LogoutBtn"

export default function NavBar({children}) {
    return (
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">vidTube</Link>
            </li>
            <li>
              <Link to="/home">Home </Link>
            </li>
            <li>
              <Link to="/users/register">Register</Link>
            </li>
            <li>
              <Link to="/users/login">Login</Link>
            </li>
            <li>
              <LogoutBtn />
            </li>
          </ul>
        </nav>
        <main>{children}</main>
      </div>
    );
}