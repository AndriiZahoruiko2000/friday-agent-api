import createHttpError from 'http-errors';

import {
  UserCollection,
  type User,
  type UserDocument,
} from '../database/models/user.js';

export type CreateUserInput = Pick<
  User,
  'email' | 'password' | 'nickname' | 'role'
>;

export const createUser = (userData: CreateUserInput) => {
  return UserCollection.create(userData);
};

export const findUserByEmail = (email: string) => {
  return UserCollection.findOne({ email });
};

export const getUserByEmail = async (email: string): Promise<UserDocument> => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  return user;
};

export const getUserById = async (id: string): Promise<UserDocument> => {
  const user = await UserCollection.findById(id);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  return user;
};
