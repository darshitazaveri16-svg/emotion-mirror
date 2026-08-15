import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../services/api";
import { persistAuth } from "../../utils/session";
import "./Welcome.css";

export default function Welcome() {
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // GUEST
  // =========================

  const continueAsGuest = () => {
    navigate("/choose-mode", {
      state: {
        userType: "guest",
        name: "Guest",
      },
    });
  };

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await authApi.login(
        loginEmail,
        loginPassword
      );

      persistAuth(data);

      // Continue to choose mode
      navigate("/choose-mode", {
        state: {
          userType: "user",
          name: data.user.name,
          user: data.user,
        },
      });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SIGNUP
  // =========================

  const handleSignup = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await authApi.signup(
        signupName,
        signupEmail,
        signupPassword
      );

      persistAuth(data);

      // Continue to choose mode
      navigate("/choose-mode", {
        state: {
          userType: "user",
          name: data.user.name,
          user: data.user,
        },
      });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // BACK TO AUTH OPTIONS
  // =========================

  const backToAuthOptions = () => {
    setShowLogin(false);
    setShowSignup(false);
    setError("");
  };

  return (
    <div className="welcome-page">

      {/* BACKGROUND EFFECTS */}

      <div className="welcome-orb welcome-orb-one"></div>
      <div className="welcome-orb welcome-orb-two"></div>
      <div className="welcome-grid"></div>


      {/* HEADER */}

      <header className="welcome-header">

        <button
          className="welcome-back"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

        <div
          className="welcome-logo"
          onClick={() => navigate("/")}
        >
          <span>🪞</span>
          Emotion<span>Mirror</span>
        </div>

        <div className="welcome-secure">
          🔒 PRIVATE
        </div>

      </header>


      {/* MAIN */}

      <main className="welcome-main">

        <div className="welcome-badge">
          <span></span>
          YOUR SPACE
        </div>

        <h1>
          Welcome to
          <br />
          <span>Emotion Mirror.</span>
        </h1>

        <p className="welcome-description">
          A space to understand what words don't say.
          Your conversations, emotions and reflections
          should belong to you.
        </p>


        {/* AUTH CARD */}

        <section className="welcome-card">

          {/* =========================
              AUTH OPTIONS
          ========================= */}

          {!showLogin && !showSignup && (
            <>
              <div className="welcome-card-title">
                <h2>How would you like to continue?</h2>

                <p>
                  Create an account to keep your history,
                  or explore instantly as a guest.
                </p>
              </div>


              {/* LOGIN BUTTON */}

              <button
                className="auth-main-button"
                onClick={() => {
                  setError("");
                  setShowLogin(true);
                }}
              >
                <span className="auth-button-icon">→</span>

                <div>
                  <strong>Log in</strong>
                  <small>Continue with your account</small>
                </div>

                <span className="auth-arrow">›</span>
              </button>


              {/* SIGN UP BUTTON */}

              <button
                className="auth-main-button"
                onClick={() => {
                  setError("");
                  setShowSignup(true);
                }}
              >
                <span className="auth-button-icon signup-icon">
                  +
                </span>

                <div>
                  <strong>Create account</strong>
                  <small>Save your conversations & history</small>
                </div>

                <span className="auth-arrow">›</span>
              </button>


              <div className="auth-divider">
                <span></span>
                OR
                <span></span>
              </div>


              {/* GUEST */}

              <button
                className="guest-button"
                onClick={continueAsGuest}
              >
                Continue as Guest
                <span>→</span>
              </button>


              <p className="guest-note">
                You can explore Emotion Mirror without
                creating an account.
              </p>
            </>
          )}


          {/* =========================
              LOGIN FORM
          ========================= */}

          {showLogin && (
            <form
              className="auth-form"
              onSubmit={handleLogin}
            >

              <button
                type="button"
                className="form-back"
                onClick={backToAuthOptions}
              >
                ← Back
              </button>

              <div className="form-heading">
                <div className="form-icon">→</div>

                <div>
                  <h2>Welcome back.</h2>
                  <p>Log in to continue your journey.</p>
                </div>
              </div>


              <label>Email</label>

              <input
                type="email"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(event) =>
                  setLoginEmail(event.target.value)
                }
                required
              />


              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(event) =>
                  setLoginPassword(event.target.value)
                }
                required
              />


              {/* ERROR */}

              {error && (
                <p
                  style={{
                    color: "#ff7b7b",
                    fontSize: "14px",
                    marginTop: "10px",
                  }}
                >
                  {error}
                </p>
              )}


              <button
                type="submit"
                className="form-submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log in"}
                {!loading && <span>→</span>}
              </button>

            </form>
          )}


          {/* =========================
              SIGNUP FORM
          ========================= */}

          {showSignup && (
            <form
              className="auth-form"
              onSubmit={handleSignup}
            >

              <button
                type="button"
                className="form-back"
                onClick={backToAuthOptions}
              >
                ← Back
              </button>

              <div className="form-heading">
                <div className="form-icon signup-form-icon">
                  +
                </div>

                <div>
                  <h2>Create your space.</h2>
                  <p>Your history stays connected to you.</p>
                </div>
              </div>


              <label>Your name</label>

              <input
                type="text"
                placeholder="What should we call you?"
                value={signupName}
                onChange={(event) =>
                  setSignupName(event.target.value)
                }
                required
              />


              <label>Email</label>

              <input
                type="email"
                placeholder="you@example.com"
                value={signupEmail}
                onChange={(event) =>
                  setSignupEmail(event.target.value)
                }
                required
              />


              <label>Password</label>

              <input
                type="password"
                placeholder="Create a password"
                value={signupPassword}
                onChange={(event) =>
                  setSignupPassword(event.target.value)
                }
                minLength={6}
                required
              />


              {/* ERROR */}

              {error && (
                <p
                  style={{
                    color: "#ff7b7b",
                    fontSize: "14px",
                    marginTop: "10px",
                  }}
                >
                  {error}
                </p>
              )}


              <button
                type="submit"
                className="form-submit"
                disabled={loading}
              >
                {loading
                  ? "Creating account..."
                  : "Create account"}

                {!loading && <span>→</span>}
              </button>

            </form>
          )}

        </section>


        {/* PRIVACY */}

        <div className="welcome-privacy">

          <div className="privacy-item">
            <span>🔒</span>
            Private by design
          </div>

          <div className="privacy-item">
            <span>🪞</span>
            No judgement
          </div>

          <div className="privacy-item">
            <span>✦</span>
            AI-assisted reflection
          </div>

        </div>

      </main>

    </div>
  );
}