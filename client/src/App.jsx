import { Routes, Route } from "react-router-dom";

import Landing from "./pages/landing/landing";
import ChooseMode from "./pages/ChooseMode/ChooseMode";
import LiveSetup from "./pages/live/LiveSetup";
import LiveInvite from "./pages/live/LiveInvite";
import LiveRoom from "./pages/live/LiveRoom";
import JoinRoom from "./pages/live/JoinRoom";
import WaitingRoom from "./pages/live/WaitingRoom";
import BothJoined from "./pages/live/BothJoined";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/choose-mode" element={<ChooseMode />} />
      <Route path="/live/setup"  element={<LiveSetup />} />
      <Route path="/live/invite" element={<LiveInvite />} />
      <Route path="/live/room" element={<LiveRoom />} />
      <Route path="/live/join" element={<JoinRoom />} />
      <Route path="/live/waiting" element={<WaitingRoom />} />
      <Route path="/live/both-joined" element={<BothJoined />} />
      <Route
        path="/private/setup"
        element={
          <div className="test-page">
            <h1>Private Setup</h1>
          </div>
        }
      />

      <Route
        path="/solo"
        element={
          <div className="test-page">
            <h1>Solo Reflection</h1>
          </div>
        }
      />
    </Routes>
  );
}

export default App;