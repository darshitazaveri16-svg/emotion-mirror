import { useNavigate } from "react-router-dom";
import "./PrivateEnd.css";

export default function PrivateEnd() {
  const navigate = useNavigate();

  return (
    <div className="private-end-page">

      <div className="private-end-content">

        <div className="end-icon">
          🪞
        </div>

        <p className="end-label">
          CONVERSATION COMPLETE
        </p>

        <h1>
          Take a moment
          <br />
          <span>to reflect.</span>
        </h1>

        <p className="end-description">
          Your conversation has ended.
          Your private emotional reflection is ready.
        </p>

        <button
          onClick={() => navigate("/private/reflection")}
        >
          See My Reflection →
        </button>

      </div>

    </div>
  );
}