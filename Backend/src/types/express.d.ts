declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: {
        id: string;
        displayName: string;
        emails?: Array<{ value: string }>;
        photos?: Array<{ value: string }>;
      };
    }
  }
}

export {};