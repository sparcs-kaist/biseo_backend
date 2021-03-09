import { SSOUser } from './types';

declare module 'express-serve-static-core' {
  interface Request {
    decoded: SSOUser;
    token: string;
  }
}