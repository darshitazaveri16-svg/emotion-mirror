const createObjectId = () => {
  const timestamp = Math.floor(Date.now() / 1000)
    .toString(16)
    .padStart(8, "0");

  const random = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");

  return `${timestamp}${random}`.slice(0, 24);
};

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

export const getSessionUserId = () => {
  const user = getStoredUser();

  if (user?.id) {
    return user.id;
  }

  let guestUserId = localStorage.getItem("guestUserId");

  if (!guestUserId) {
    guestUserId = createObjectId();
    localStorage.setItem("guestUserId", guestUserId);
  }

  return guestUserId;
};

export const getSessionUserName = () => {
  const user = getStoredUser();

  if (user?.name) {
    return user.name;
  }

  return localStorage.getItem("guestName") || "Guest";
};

export const setGuestName = (name) => {
  localStorage.setItem("guestName", name);
};

export const persistAuth = ({ token, user }) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("userId", user.id);
};

export const clearSessionRoom = () => {
  localStorage.removeItem("roomId");
  localStorage.removeItem("conversationId");
};

export const persistSessionRoom = ({
  roomId,
  conversationId,
  language,
  mode,
}) => {
  if (roomId) {
    localStorage.setItem("roomId", roomId);
  }

  if (conversationId) {
    localStorage.setItem("conversationId", conversationId);
  }

  if (language) {
    localStorage.setItem("language", language);
  }

  if (mode) {
    localStorage.setItem("roomMode", mode);
  }
};

export const isAuthenticated = () =>
  Boolean(localStorage.getItem("token"));

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "gu", label: "Gujarati" },
];

export const getLanguageLabel = (code) =>
  LANGUAGES.find((item) => item.code === code)?.label ||
  "English";
