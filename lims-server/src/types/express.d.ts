// src/types/express.d.ts

import { IUser } from "../../models/user.model"; // relative import, not alias

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {}; // <--- THIS IS IMPORTANT to make it a module
