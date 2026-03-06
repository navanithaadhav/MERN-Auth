import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized. Login Again" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    if (decoded && typeof decoded === 'object' && decoded.id) {
      req.userId = decoded.id; // Attach userId to req, not req.body
      next();
    } else {
      return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
    }
  } catch (error) {
    console.error("Auth Token Error:", error);
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ success: false, message: "Session Expired. Login Again" });
    }
    return res.status(401).json({ success: false, message: "Invalid Token. Login Again" });
  }
}
export default userAuth;