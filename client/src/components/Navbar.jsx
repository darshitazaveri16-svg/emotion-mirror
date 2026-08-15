import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => navigate("/")}>
        <span className="logo-icon">🪞</span>
        <span>Emotion<span>Mirror</span></span>
      </div>

      <div className="nav-links">
        <a href="#how-it-works">How It Works</a>
        <a href="#modes">Modes</a>
        <a href="#features">Features</a>
      </div>

      <button
        className="nav-button"
        onClick={() => navigate("/welcome")}
      >
        Get Started
      </button>
    </nav>
  );
}