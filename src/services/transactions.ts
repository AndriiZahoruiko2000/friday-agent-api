import { FilterQuery } from 'mongoose';
import { UserDocument } from '../database/models/user.js';
import {
  Transactions,
  TransactionsCollection,
} from '../database/models/transactions.js';
import { BudgetCollection } from '../database/models/budget.js';
import createHttpError from 'http-errors';
import { convertCurrency } from '../helpers/countCurrency.js';

export interface TransactionParams {
  amount?: number;
  budgetId?: string;
  transactionType?: string;
  currency?: string;
  category?: string;
  tags?: string;
  userId?: string;
  note?: string;
}

export const getTransactionService = async (
  params: TransactionParams,
  user: UserDocument,
) => {
  const query: FilterQuery<Transactions> = {};
  query.userId = user._id;

  if (params.amount) {
    query.amount = params.amount;
  }

  if (params.budgetId) {
    query.budgetId = params.budgetId;
  }

  if (params.transactionType) {
    query.transactionType = params.transactionType;
  }

  if (params.currency) {
    query.currency = params.currency;
  }

  if (params.category) {
    query.category = params.category;
  }

  if (params.tags) {
    query.tags = params.tags;
  }

  if (params.userId) {
    query.userId = params.userId;
  }

  if (params.note) {
    query.note = params.note;
  }

  const result = TransactionsCollection.find(query);
  return result;
};

export const getTransactionByIdService = async (transactionId: string) => {
  const result = TransactionsCollection.findById(transactionId);
  return result;
};

export const createTransactionService = async (
  body: Transactions,
  user: UserDocument,
) => {
  const transaction = { ...body, userId: user._id };
  const budget = await BudgetCollection.findById(body.budgetId);

  if (budget && body.transactionType === 'deposit') {
    budget.balance += convertCurrency(
      body.amount,
      body.currency,
      budget.currency,
    );
  } else if (budget && body.transactionType === 'withdraw') {
    budget.balance -= convertCurrency(
      body.amount,
      body.currency,
      budget.currency,
    );
  }

  await budget?.save();

  const result = await TransactionsCollection.create(transaction);
  return result;
};

export const updateTransactionService = async (
  transactionId: string,
  body: Transactions,
  userId: string,
) => {
  const transaction = await TransactionsCollection.findOne({
    _id: transactionId,
    userId: userId,
  });

  if (!transaction) {
    throw createHttpError(404, 'Transaction not found');
  }

  const budget = await BudgetCollection.findById(transaction.budgetId);

  if (budget && transaction.transactionType === 'deposit') {
    budget.balance -= convertCurrency(
      transaction.amount,
      transaction.currency,
      budget.currency,
    );
  } else if (budget && transaction.transactionType === 'withdraw') {
    budget.balance += convertCurrency(
      transaction.amount,
      transaction.currency,
      budget.currency,
    );
  }

  if (budget && body.transactionType === 'deposit') {
    budget.balance += convertCurrency(
      body.amount,
      body.currency,
      budget.currency,
    );
  } else if (budget && body.transactionType === 'withdraw') {
    budget.balance -= convertCurrency(
      body.amount,
      body.currency,
      budget.currency,
    );
  }

  await budget?.save();

  const result = await TransactionsCollection.findOneAndUpdate(
    {
      _id: transactionId,
      userId,
    },
    body,
  );
  return result;
};

export const deleteTransactionService = async (
  transactionId: string,
  user: UserDocument,
) => {
  const transaction = await TransactionsCollection.findOne({
    _id: transactionId,
    userId: user._id,
  });

  if (!transaction) {
    throw createHttpError(404, 'Transaction not found');
  }

  const budget = await BudgetCollection.findById(transaction.budgetId);

  if (budget && transaction.transactionType === 'deposit') {
    budget.balance -= convertCurrency(
      transaction.amount,
      transaction.currency,
      budget.currency,
    );
  } else if (budget && transaction.transactionType === 'withdraw') {
    budget.balance += convertCurrency(
      transaction.amount,
      transaction.currency,
      budget.currency,
    );
  }

  await budget?.save();
  await transaction.deleteOne();

  return transaction;
};
