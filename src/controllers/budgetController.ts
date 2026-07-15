import { RequestHandler } from 'express';
import {
  createBudget,
  deleteBudget,
  getBudget,
  getBudgetById,
  GetBudgetProps,
  updateBudget,
} from '../services/budgetService.js';
import { User, UserDocument } from '../database/models/user.js';

export const getBudgetController: RequestHandler = async (req, res) => {
  const user = req.user;
  const params = req.query;
  const response = await getBudget(
    params as GetBudgetProps,
    user as UserDocument,
  );
  return res.status(200).json(response);
};

export const getBudgetByIdController: RequestHandler = async (req, res) => {
  const user = req.user;
  const { budgetId } = req.params;
  const response = await getBudgetById(budgetId, user as UserDocument);
  return res.status(200).json(response);
};

export const createBudgetController: RequestHandler = async (req, res) => {
  const user = req.user;
  const body = req.body;
  const response = await createBudget(body, user as UserDocument);
  return res.status(200).json(response);
};

export const updateBudgetController: RequestHandler = async (req, res) => {
  const user = req.user;
  const { budgetId } = req.params;
  const body = req.body;
  const response = await updateBudget(budgetId, body, user as UserDocument);
  return res.status(200).json(response);
};

export const deleteBudgetController: RequestHandler = async (req, res) => {
  const user = req.user;
  const { budgetId } = req.params;
  const response = await deleteBudget(budgetId, user as UserDocument);
  return res.status(200).json(response);
};
