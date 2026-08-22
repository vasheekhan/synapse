import "express";

declare global {
  namespace Express {
    interface User {
      id: string;
      emails?: Array<{
        value: string;
      }>;
      displayName: string;
      photos?: Array<{
        value: string;
      }>;
    }
  }
}

export {};