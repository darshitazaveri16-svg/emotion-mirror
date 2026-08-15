import { Routes, Route } from "react-router-dom";

import Landing from "./pages/landing/landing";
import ChooseMode from "./pages/ChooseMode/ChooseMode";
import Welcome from "./pages/auth/Welcome";
import LiveSetup from "./pages/live/LiveSetup";
import LiveInvite from "./pages/live/LiveInvite";
import LiveRoom from "./pages/live/LiveRoom";
import JoinRoom from "./pages/live/JoinRoom";
import WaitingRoom from "./pages/live/WaitingRoom";
import BothJoined from "./pages/live/BothJoined";

import PrivateSetup from "./pages/private/PrivateSetup";
import CreatePrivateRoom from "./pages/private/CreatePrivateRoom";
import PrivateRoomCreated from "./pages/private/PrivateRoomCreated";
import PrivateInvite from "./pages/private/PrivateInvite";
import PartnerJoin from "./pages/private/PrivateJoin";
import PrivateWaiting from "./pages/private/PrivateWaiting";
import BothPrivateJoined from "./pages/private/BothPrivateJoined";
import PrivateConversation from "./pages/private/PrivateConversation";
import PrivateMirror from "./pages/private/PrivateMirror";
import PrivateEnd from "./pages/private/PrivateEnd";
import PrivateReflection from "./pages/private/PrivateReflection";
import SoloReflection from "./pages/solo/SoloReflection";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/choose-mode" element={<ChooseMode />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/live/setup" element={<LiveSetup />} />
      <Route path="/live/invite" element={<LiveInvite />} />
      <Route path="/live/room" element={<LiveRoom />} />
      <Route path="/live/join" element={<JoinRoom />} />
      <Route path="/live/waiting" element={<WaitingRoom />} />
      <Route path="/live/both-joined" element={<BothJoined />} />

      <Route path="/private/setup" element={<PrivateSetup />} />
      <Route path="/private/create-room" element={<CreatePrivateRoom />} />
      <Route path="/private/room-created" element={<PrivateRoomCreated />} />
      <Route path="/private/invite" element={<PrivateInvite />} />
      <Route path="/private/join" element={<PartnerJoin />} />
      <Route path="/private/waiting" element={<PrivateWaiting />} />
      <Route path="/private/both-joined" element={<BothPrivateJoined />} />
      <Route path="/private/conversation" element={<PrivateConversation />} />
      <Route path="/private/mirror" element={<PrivateMirror />} />
      <Route path="/private/end" element={<PrivateEnd />} />
      <Route path="/private/reflection" element={<PrivateReflection />} />

      <Route path="/solo" element={<SoloReflection />} />
    </Routes>
  );
}

export default App;
