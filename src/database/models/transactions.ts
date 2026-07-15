import { HydratedDocument, InferSchemaType, Schema, model } from 'mongoose';

const transactionsSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
      default: 0,
    },

    budgetId: {
      type: String,
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

transactionsSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type Transactions = InferSchemaType<typeof transactionsSchema>;
export type TransactionsDocument = HydratedDocument<Transactions>;

export const TransactionsCollection = model<Transactions>(
  'transactions',
  transactionsSchema,
);
