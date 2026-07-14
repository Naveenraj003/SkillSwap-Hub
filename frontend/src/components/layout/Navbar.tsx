import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <Link to="/" className="font-bold text-xl">
        SkillSwap Hub
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/">
          Home
        </Link>

        <Link to="/explore">
          Explore Skills
        </Link>

        <Link to="/#how-it-works">
          How It Works
        </Link>

        <Link to="/login">
          Login
        </Link>

        <Link to="/register">
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;