import { TransportOptions } from 'nodemailer';
import { env } from '../utils/env.js';

export const ONE_HOUR = 60 * 60 * 1000;
export const ONE_DAY = ONE_HOUR * 24;
export const ONE_WEEK = ONE_DAY * 7;
export const ONE_MONTH = ONE_DAY * 31;

export const ACCESS_TOKEN_SECRET = env('JWT_ACCESS_SECRET');
export const ACCESS_TOKEN_EXPIRES_IN = env('ACCESS_TOKEN_EXPIRES_IN', '1d');

export const MONGODB_USER = env('MONGODB_USER');
export const MONGODB_PASSWORD = env('MONGODB_PASSWORD');
export const MONGODB_URL = env('MONGODB_URL');
export const MONGODB_DB = env('MONGODB_DB');

export const JWT_SECRET = env('JWT_ACCESS_SECRET');

export const SMTP_SERVER = env('SMTP_SERVER') as string;
export const SMTP_PORT = env('SMTP_PORT') as string;
export const SMTP_LOGIN = env('SMTP_LOGIN') as string;
export const SMTP_KEY = env('SMTP_KEY') as string;

export const OBJECT: TransportOptions = {};
