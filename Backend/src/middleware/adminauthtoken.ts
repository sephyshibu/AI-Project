import { Request, Response, NextFunction } from "express"; 
import jwt,{TokenExpiredError} from 'jsonwebtoken'


interface CustomRequest extends Request {
    adminemail?: string;
}

export const authToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const adminemail = req.headers['admin-email'] as string;
  const token = authHeader && authHeader.split(' ')[1];
    console.log(adminemail)
  if (!token) {
      res.status(401).json({ message: 'Access token required' });
      return;
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { adminemail: string };
      (req as CustomRequest).adminemail = decoded.adminemail; 

      if (!adminemail) {
          res.status(400).json({ message: "adminemail is required in headers" });
          return;
      }

  

      next();
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
        res.status(401).json({ message: "Token expired" });  // Send 401 when token is expired
        return;
    }
    if(error.message==="adminemail is required in headers"){
        res.status(400).json({message:"please login in"})
    }
    if (error.message === "adminemail is inactive") {
        res.status(403).json({ message: "User is inactive. Please logout", action: "logout" });
        return;
    }
    if (error.message === "Admin email not found") {
        res.status(404).json({ message: "User not found" });
        return;
    }
    if (error.message === "admin email is Blocked") {
        res.status(403).json({ message: "User is blocked by admin", action: "blocked" });
        return;
    }
    console.error("Error in checkAdminStatus middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
}

};