export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: "💬",
      title: "Share the conversation",
      text: "Talk naturally, paste messages, or describe what happened."
    },
    {
      number: "02",
      icon: "🧠",
      title: "AI understands context",
      text: "Emotion Mirror looks at language, context and emotional patterns."
    },
    {
      number: "03",
      icon: "🪞",
      title: "See another perspective",
      text: "Explore possible emotional signals without pretending to read minds."
    }
  ];

  return (
    <section className="section how-section" id="how-it-works">

      <div className="section-heading">
        <span className="eyebrow">HOW IT WORKS</span>

        <h2>
          Turn difficult conversations
          <br />
          into <span>understanding.</span>
        </h2>

        <p>
          Emotion Mirror helps make the emotional layer of communication
          easier to see.
        </p>
      </div>

      <div className="steps-grid">

        {steps.map((step) => (
          <div className="step-card" key={step.number}>

            <div className="step-top">
              <span className="step-number">{step.number}</span>
              <span className="step-icon">{step.icon}</span>
            </div>

            <h3>{step.title}</h3>

            <p>{step.text}</p>

          </div>
        ))}

      </div>

    </section>
  );
}