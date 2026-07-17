import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_SECRET,
  JWT_SECRET,
  ONE_MONTH,
} from '../helpers/constants.js';
import {
  User,
  UserCollection,
  type UserDocument,
} from '../database/models/user.js';
import {
  createUser,
  findUserByEmail,
  getUserByEmail,
  getUserById,
} from './userService.js';
import {
  createSession,
  deleteSessionByToken,
  getSessionByToken,
  rotateSession,
} from './sessionService.js';
import { sendEmail } from '../utils/mail.js';

type RegisterPayload = {
  email: string;
  password: string;
  nickname?: string;
  role?: 'user' | 'admin';
};

type LoginPayload = {
  email: string;
  password: string;
};

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

type SessionMeta = {
  userAgent?: string;
  ip?: string;
};

const SALT_ROUNDS = 12;
const REFRESH_TOKEN_VALIDITY = ONE_MONTH;

interface GooglePayLoad {
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

const createAccessToken = (user: UserDocument) => {
  const options: jwt.SignOptions = {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  };

  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    ACCESS_TOKEN_SECRET as jwt.Secret,
    options,
  );
};

const createRefreshToken = () => crypto.randomBytes(64).toString('hex');

const createSessionForUser = async (
  user: UserDocument,
  meta: SessionMeta,
): Promise<AuthTokens> => {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_VALIDITY);

  await createSession({
    userId: user._id.toString(),
    refreshToken,
    expiresAt,
    userAgent: meta.userAgent,
    ip: meta.ip,
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const registerUserService = async ({
  email,
  password,
  role = 'user',
  nickname,
}: RegisterPayload) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw createHttpError(409, 'Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  await createUser({
    email: normalizedEmail,
    password: hashedPassword,
    role,
    nickname: nickname?.trim() || normalizedEmail,
  });

  return { message: 'User successfully registered' };
};

export const loginService = async (
  { email, password }: LoginPayload,
  meta: SessionMeta,
): Promise<AuthTokens> => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await getUserByEmail(normalizedEmail);

  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password');
  }

  return createSessionForUser(user, meta);
};

export const refreshService = async (
  refreshToken: string,
  meta: SessionMeta,
): Promise<AuthTokens> => {
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token is required');
  }

  const session = await getSessionByToken(refreshToken);

  if (!session) {
    throw createHttpError(401, 'Refresh token invalid');
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await deleteSessionByToken(refreshToken);
    throw createHttpError(401, 'Refresh token expired');
  }

  const user = await getUserById(session.userId.toString());
  const newRefreshToken = createRefreshToken();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_VALIDITY);

  await rotateSession(session._id.toString(), newRefreshToken, expiresAt, meta);

  return {
    accessToken: createAccessToken(user),
    refreshToken: newRefreshToken,
  };
};

export const logoutService = async (refreshToken?: string) => {
  if (!refreshToken) return;
  await deleteSessionByToken(refreshToken);
};

export const googleAuth = async (jwtToken: string) => {
  const payload = jwt.decode(jwtToken) as GooglePayLoad;
  let user = await UserCollection.findOne({ email: payload.email });

  if (!user) {
    await registerUserService({
      email: payload.email,
      password: '',
      nickname: payload.email,
    });
    user = await UserCollection.findOne({ email: payload.email });
  }

  return createSessionForUser(user as UserDocument, {});
};

export const forgotPassword = async (email: string) => {
  const user = await UserCollection.findOne({ email });

  if (!user) {
    return;
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '15m' });

  const markup = `<a href="http://localhost:3000/auth/confirm-password?token=${token}">Reset Password</a>`;

  await sendEmail({
    from: 'zahoruiko.andrii17@gmail.com',
    to: email,
    subject: 'Reset Friday Password',
    html: markup,
  });
};

export const confirmPassword = async (token: string, newPassword: string) => {
  const payload = jwt.verify(token, JWT_SECRET) as { id: string };
  const userID = payload.id;

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  const user = await UserCollection.findByIdAndUpdate(userID, {
    password: hashedPassword,
  });
  return user;
};
