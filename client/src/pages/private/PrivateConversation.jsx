import { useNavigate } from "react-router-dom";
import "./PrivateConversation.css";

export default function PrivateConversation() {
  const navigate = useNavigate();

  return (
    <div className="private-conversation-page">

      <header className="conversation-header">

        <div className="conversation-logo">
          🪞 Emotion<span>Mirror</span>
        </div>

        <div className="conversation-status">
          <span></span>
          PRIVATE CONVERSATION
        </div>

        <button
          className="end-header-button"
          onClick={() => navigate("/private/end")}
        >
          End
        </button>

      </header>


      <main className="conversation-main">

        <div className="conversation-top">

          <div>
            <div className="conversation-label">
              SHARED SPACE
            </div>

            <h1>
              Talk it out.
            </h1>
          </div>

          <div className="temperature-mini">
            <span>●</span>
            Calm
          </div>

        </div>


        <section className="messages-area">

          <div className="message-row person-a">

            <div className="message-avatar">
              Y
            </div>

            <div>
              <small>You</small>

              <div className="message-bubble">
                I feel like you're not really listening to me.
              </div>

              <span className="message-time">
                10:42 AM
              </span>
            </div>

          </div>


          <div className="message-row person-b">

            <div className="message-avatar partner">
              P
            </div>

            <div>
              <small>Partner</small>

              <div className="message-bubble">
                I am listening. I just don't know what to say.
              </div>

              <span className="message-time">
                10:43 AM
              </span>
            </div>

          </div>


          <div className="message-row person-a">

            <div className="message-avatar">
              Y
            </div>

            <div>
              <small>You</small>

              <div className="message-bubble">
                I just want you to understand why this hurt me.
              </div>

              <span className="message-time">
                10:44 AM
              </span>
            </div>

          </div>

        </section>


        <section className="conversation-input-area">

          <input
            type="text"
            placeholder="Type what you want to say..."
          />
           
         <div className="conversation-controls">

          <button>
            🎤 Voice
          </button>

          <button>
            ⏸ Pause
          </button>

          <button onClick={() => navigate("/private/mirror")}>
            🪞 My Mirror
          </button>

        </div>  
          <button>
            ↑
          </button>

        </section>


        <div className="conversation-footer-note">
          🔒 Your private emotional mirror is separate from this shared conversation.
        </div>

      </main>

    </div>
  );
}