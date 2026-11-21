import { Link, NavLink } from 'react-router'
import "./FarmHeader.css"
import PlusIcon from "../icons/PlusIcon"
import FarmIcon from '../icons/FarmIcon'
import ToggleDarkMode from "./ToggleDarkMode.jsx"

const FarmHeader = () => {
  /*
try {
  const t = localStorage.getItem("theme");
  if (t) document.documentElement.dataset.theme = t;
} catch {}
 btn.addEventListener("click", () => {
const next = currentTheme() === "dark" ? "light" : "dark";
root.dataset.theme = next;
try { localStorage.setItem("theme", next); } catch {}
});
*/
  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          {/* Brand: plain Link (not NavLink) so it never gets an "active" style */}
          <Link to="/farm-forum" className="navbar-brand" aria-label="Crewmates, go to dashboard">
            <span className="navbar-mark">
              <FarmIcon />
            </span>
            <span className="navbar-brand-text">
              <strong>Farm Feed</strong>
              <small>Farm forums</small>
            </span>
          </Link>


          <nav className="navbar-links" aria-label="Main Header">
            <NavLink to="/farm-forum" end className="navbar-link">
              Dashboard
            </NavLink>
            <NavLink to="/farm-forum/add" className="navbar-link navbar-cta">
              <PlusIcon />
              Add post
            </NavLink>

            <ToggleDarkMode/>
          </nav>
        </div>
      </header>
    </>
  );
}
export default FarmHeader;

// Thank you, https://tania.dev/redesign-version-7/
// Thank you, https://github.com/axb157030/Crewmates/blob/main/src/components/Navbar.jsx