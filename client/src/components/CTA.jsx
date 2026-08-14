import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="cta-section">

      <div className="cta-glow"></div>

      <span className="eyebrow">START UNDERSTANDING</span>

      <h2>
        Every conversation
        <br />
        has another side.
      </h2>

      <p>
        See what words don't say.
      </p>

      <button
        className="primary-button cta-button"
        onClick={() => navigate("/choose-mode")}
      >
        Start Understanding
        <span>→</span>
      </button>

    </section>
  );
}