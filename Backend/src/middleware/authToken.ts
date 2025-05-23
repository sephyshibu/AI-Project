import { Request, Response, NextFunction } from "express"; 
import jwt,{TokenExpiredError} from 'jsonwebtoken'


interface CustomRequest extends Request {
    userId?: string;
}

export const authToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const userId = req.headers['user-id'] as string;
  const token = authHeader && authHeader.split(' ')[1];
    console.log(userId)
  if (!token) {
      res.status(401).json({ message: 'Access token required' });
      return;
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
      (req as CustomRequest).userId = decoded.userId; 

      if (!userId) {
          res.status(400).json({ message: "User ID is required in headers" });
          return;
      }

  

      next();
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
        res.status(401).json({ message: "Token expired" });  // Send 401 when token is expired
        return;
    }
    if(error.message==="User ID is required in headers"){
        res.status(400).json({message:"please login in"})
    }
    if (error.message === "User is inactive") {
        res.status(403).json({ message: "User is inactive. Please logout", action: "logout" });
        return;
    }
    if (error.message === "User not found") {
        res.status(404).json({ message: "User not found" });
        return;
    }
    if (error.message === "User is Blocked") {
        res.status(403).json({ message: "User is blocked by admin", action: "blocked" });
        return;
    }
    console.error("Error in checkUserStatus middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
}

};