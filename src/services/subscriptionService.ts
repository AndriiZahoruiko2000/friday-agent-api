import { FilterQuery } from 'mongoose';
import {
  Subscriptions,
  SubscriptionsCollection,
} from '../database/models/subscriptions.js';
import { UserDocument } from '../database/models/user.js';

import { BudgetCollection } from '../database/models/budget.js';

export interface SubscriptionParams {
  title?: string;
  amount?: number;
  budgetId?: string;
  subscriptionType?: string;
  dateOfWithdrawal?: string;
  isActive?: boolean;
  transactionType?: string;
  currency?: string;
  category?: string;
  tags?: string;
  userId?: string;
  note?: string;
}

export const getSubscriptionService = async (
  params: SubscriptionParams,
  user: UserDocument,
) => {
  const query: FilterQuery<Subscriptions> = {};
  query.userId = user._id;

  if (params.title) {
    query.title = params.title;
  }

  if (params.amount) {
    query.amount = params.amount;
  }

  if (params.budgetId) {
    const budget = await BudgetCollection.findById(params.budgetId);
    const userIds = budget?.userIds || [];
    query.userId = { $in: userIds };
    query.budgetId = params.budgetId;
  }

  if (params.category) {
    query.category = params.category;
  }

  if (params.currency) {
    query.currency = params.currency;
  }

  if (params.dateOfWithdrawal) {
    query.dateOfWithdrawal = params.dateOfWithdrawal;
  }

  if (params.isActive) {
    query.isActive = params.isActive;
  }

  if (params.note) {
    query.note = params.note;
  }

  if (params.subscriptionType) {
    query.subscriptionType = params.subscriptionType;
  }

  if (params.tags) {
    query.tags = params.tags;
  }

  if (params.transactionType) {
    query.transactionType = params.transactionType;
  }

  if (params.userId) {
    query.userId = params.userId;
  }

  const result = await SubscriptionsCollection.find(query);
  return result;
};

export const getSubscriptionByIdService = async (
  subscriptionId: string,
  userId: string,
) => {
  const result = await SubscriptionsCollection.findOne({
    subscriptionId,
    userId,
  });
  return result;
};

export const createSubscriptionService = async (
  body: Subscriptions,
  user: UserDocument,
) => {
  const result = await SubscriptionsCollection.create({ ...body, user });
  return result;
};

export const updateSubscriptionService = async (
  subscriptionId: string,
  body: Subscriptions,
  user: UserDocument,
) => {
  const result = await SubscriptionsCollection.findOneAndUpdate(
    {
      _id: subscriptionId,
      userId: user._id,
    },
    body,
  );
  return result;
};

export const deleteSubscriptionService = async (
  subscriptionId: string,
  userId: string,
) => {
  const result = await SubscriptionsCollection.findOneAndDelete({
    _id: subscriptionId,
    userId,
  });
  return result;
};
