import { RequestHandler } from 'express';
import {
  createTransactionService,
  deleteTransactionService,
  getTransactionByIdService,
  getTransactionService,
  updateTransactionService,
} from '../services/transactions.js';
import { UserDocument } from '../database/models/user.js';

export const getTransactionController: RequestHandler = async (req, res) => {
  const params = req.query;
  const user = req.user;
  const response = await getTransactionService(params, user as UserDocument);
  return res.status(200).json(response);
};

export const getTransactionByIdController: RequestHandler = async (
  req,
  res,
) => {
  const { transactionId } = req.params;
  const response = await getTransactionByIdService(transactionId as string);
  return res.status(200).json(response);
};

export const createTransactionController: RequestHandler = async (req, res) => {
  const body = req.body;
  const user = req.user;
  const response = await createTransactionService(body, user as UserDocument);
  return res.status(200).json(response);
};

export const updateTransactionController: RequestHandler = async (req, res) => {
  const user = req.user as UserDocument;
  const userId = user._id;
  const { transactionId } = req.params;
  const body = req.body;

  const response = await updateTransactionService(
    transactionId,
    body,
    String(userId),
  );
  return res.status(200).json(response);
};

export const deleteTransactionController: RequestHandler = async (req, res) => {
  const { transactionId } = req.params;
  const user = req.user;
  const response = await deleteTransactionService(
    transactionId,
    user as UserDocument,
  );
  return res.status(200).json(response);
};
