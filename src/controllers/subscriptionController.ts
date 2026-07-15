import { RequestHandler } from 'express';
import {
  createSubscriptionService,
  deleteSubscriptionService,
  getSubscriptionByIdService,
  getSubscriptionService,
  updateSubscriptionService,
} from '../services/subscriptionService.js';
import { UserDocument } from '../database/models/user.js';

export const getSubscriptionController: RequestHandler = async (req, res) => {
  const params = req.query;
  const user = req.user;
  const response = await getSubscriptionService(params, user as UserDocument);
  return res.status(200).json(response);
};

export const getSubscriptionByIdController: RequestHandler = async (
  req,
  res,
) => {
  const { subscriptionId } = req.params;
  const user = req.user;
  const userId = user?._id;
  const response = await getSubscriptionByIdService(
    subscriptionId,
    String(userId),
  );
  return res.status(200).json(response);
};

export const createSubscriptionController: RequestHandler = async (
  req,
  res,
) => {
  const body = req.body;
  const user = req.user;
  const response = await createSubscriptionService(body, user as UserDocument);
  return res.status(200).json(response);
};

export const updateSubscriptionController: RequestHandler = async (
  req,
  res,
) => {
  const { subscriptionId } = req.params;
  const body = req.body;
  const user = req.user;
  const response = await updateSubscriptionService(
    subscriptionId,
    body,
    user as UserDocument,
  );
  return res.status(200).json(response);
};

export const name: RequestHandler = async (req, res) => {
  const { subscriptionId } = req.params;
  const user = req.user;
  const userId = user?._id;

  const response = await deleteSubscriptionService(
    subscriptionId,
    String(userId),
  );

  return res.status(200).json(response);
};
