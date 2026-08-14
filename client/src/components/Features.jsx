export default function Features() {
  const features = [
    {
      icon: "💗",
      title: "Emotional Signals",
      text: "Explore possible emotions such as hurt, frustration, anxiety or defensiveness."
    },
    {
      icon: "🌡️",
      title: "Conversation Temperature",
      text: "See whether a conversation is cooling down, staying neutral or becoming heated."
    },
    {
      icon: "🎯",
      title: "Turning Points",
      text: "Identify moments where the emotional direction of a conversation changed."
    },
    {
      icon: "🔍",
      title: "Context Awareness",
      text: "Interpret messages using surrounding conversation rather than isolated sentences."
    },
    {
      icon: "🪞",
      title: "Perspective",
      text: "Understand possible interpretations instead of being told who is right."
    },
    {
      icon: "✨",
      title: "Optional Suggestions",
      text: "Ask for constructive communication ideas only when you want them."
    }
  ];

  return (
    <section className="section features-section" id="features">

      <div className="section-heading">
        <span className="eyebrow">THE MIRROR ENGINE</span>

        <h2>
          More than an emotion
          <br />
          <span>detector.</span>
        </h2>

        <p>
          Emotion Mirror looks at the conversation as a whole.
        </p>
      </div>

      <div className="features-grid">

        {features.map((feature) => (
          <div className="feature-card" key={feature.title}>

            <div className="feature-icon">{feature.icon}</div>

            <h3>{feature.title}</h3>

            <p>{feature.text}</p>

          </div>
        ))}

      </div>

    </section>
  );
}