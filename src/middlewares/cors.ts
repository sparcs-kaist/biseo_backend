import { RequestHandler } from 'express';

// cors middleware for development
export const corsMiddleware: RequestHandler = (req, res, next) => {
  const originRegex = /^https?:\/\/localhost(?::[0-9]{1,5})?$/;
  const origin = req.get('origin') ?? '';
  if (!originRegex.test(origin)) {
    res.status(400).send("Origin not suited for this auth server's purpose!");
    return;
  }

  res.set('Access-Control-Allow-Origin', req.get('origin'));
  res.set('Access-Control-Allow-Credentials', 'true');
  res.set('Access-Control-Allow-Methods', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type,x-access-token');

  if (req.method === 'OPTIONS') res.sendStatus(200);
  else next();
};
