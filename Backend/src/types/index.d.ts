import 'passport';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

declare module 'passport' {
  interface User {
    id: string;
    displayName: string;
    emails?: Array<{ value: string }>;
    photos?: Array<{ value: string }>;
  }
}