import { Link } from "react-router-dom"
export default function NavBar({children}) {
    return (
        <div>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/users/register">Register</Link></li>
                    <li><Link to="/users/login">Login</Link></li>
                </ul>
            </nav>
            <main>
                {children}
            </main>
        </div>
    )
}