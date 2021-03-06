import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { signToken } from '@/utils/jwt';
import client from '@/utils/sso';
import Admin from '@/models/admin';

export const authCheck = (req: Request, res: Response): void => {
  const tokenHeader = req.headers['x-access-token'];
  if (typeof tokenHeader !== 'string') {
    res.status(404).json({
      error: 'Token not included in request!',
    });
    return;
  }

  const [_, token] = tokenHeader.split(' ');
  if (token === undefined) {
    res.json({ success: false });
    return;
  }

  jwt.verify(token, process.env.TOKEN_SECRET as string, (err, _) => {
    if (err) res.json({ success: false });
    else res.json({ success: true });
  });
};

export const login = (req: Request, res: Response): void => {
  const { url, state } = client.getLoginParams();
  req.session.state = state;
  res.json({ url });
};

export const loginCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { code, state } = req.query;
  const stateBefore = req.session.state;
  if (stateBefore !== state) {
    res.status(401).json({
      error: 'TOKEN MISMATCH: session might be hijacked!',
      status: 401,
    });
    return;
  }

  const user = await client.getUserInfo(code);
  const isUserAdmin = await Admin.exists({ username: user.sparcs_id });
  const token = signToken(
    user,
    isUserAdmin,
    process.env.TOKEN_SECRET as string
  );

  res.status(200).json({ token });
};
