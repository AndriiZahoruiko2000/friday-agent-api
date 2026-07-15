import { FilterQuery } from 'mongoose';
import { Budget, BudgetCollection } from '../database/models/budget.js';
import { UserDocument } from '../database/models/user.js';

export interface GetBudgetProps {
  userId?: string;
  ownerId?: string;
  title?: string;
  category?: string;
  currency?: number;
  page?: number;
  perPage?: number;
}

export const getBudget = async (params: GetBudgetProps, user: UserDocument) => {
  const query: FilterQuery<Budget> = {};
  const result = await BudgetCollection.find({
    $or: [{ ownerId: user._id }, { userIds: user._id }],
  });
  return result;
};
export const getBudgetById = async (budgetId: string, user: UserDocument) => {
  const result = await BudgetCollection.findOne({
    _id: budgetId,
    $or: [{ ownerId: user._id }, { userIds: user._id }],
  });
  return result;
};
export const createBudget = async (body: Budget, user: UserDocument) => {
  const result = await BudgetCollection.create({ ...body, ownerId: user._id });
  return result;
};
export const updateBudget = async (
  budgetId: string,
  body: Budget,
  user: UserDocument,
) => {
  const result = await BudgetCollection.findOneAndUpdate(
    {
      _id: budgetId,
      ownerId: user._id,
    },
    body,
  );
  return result;
};
export const deleteBudget = async (budgetId: string, user: UserDocument) => {
  const result = await BudgetCollection.findOneAndDelete({
    _id: budgetId,
    ownerId: user._id,
  });
  return result;
};
