import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized. Login Again" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    if (decoded.id) {
      req.userId = decoded.id; // Attach userId to req, not req.body
      next();
    } else {
      return res.json({ success: false, message: "Not Authorized.Login Again" });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({ success: false, message: error.message });
    }
    return res.status(401).json({ success: false, message: "An unknown error occurred" });
  }
}
export default userAuth;