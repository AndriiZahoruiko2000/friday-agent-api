import { HydratedDocument, InferSchemaType, Schema, model } from 'mongoose';

const subscriptionsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      default: 0,
    },

    budgetId: {
      type: String,
      required: true,
    },

    subscriptionType: {
      type: String,
      enum: ['weekly', 'monthly', 'annual'],
      required: true,
    },

    dateOfWithdrawal: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      required: true,
    },

    transactionType: {
      type: String,
      required: true,
      enum: ['deposit', 'withdraw'],
      default: 'withdraw',
    },

    currency: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    note: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

subscriptionsSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type Subscriptions = InferSchemaType<typeof subscriptionsSchema>;
export type SubscriptionsDocument = HydratedDocument<Subscriptions>;

export const SubscriptionsCollection = model<Subscriptions>(
  'subscriptions',
  subscriptionsSchema,
);
