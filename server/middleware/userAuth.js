import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {    
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized. Login Again" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id) {
      req.userId = decoded.id; // Attach userId to req, not req.body
      next();
    } else {
      return res.json({ success: false, message: "Not Authorized.Login Again" });
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
}
export default userAuth;