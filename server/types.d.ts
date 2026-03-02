import "express-session";

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      role: "user" | "hospital" | "ambulance";
      fullName: string;
    }
  }
}

export {};
