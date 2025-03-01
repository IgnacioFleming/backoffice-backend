export const setAuthHeaderToSessionCookie = (req, res, next) => {
  const sessionId = req.headers.authorization?.replace("Session ", "");
  if (sessionId) {
    req.cookies = req.cookies || {};
    req.cookies["connect.sid"] = sessionId;
  }
  next();
};
