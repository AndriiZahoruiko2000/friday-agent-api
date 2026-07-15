import { HydratedDocument, InferSchemaType, Schema, model } from 'mongoose';

const budgetSchema = new Schema(
  {
    balance: {
      type: Number,
      default: 0,
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },

    userIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
    ],

    title: {
      type: String,
      min: 3,
      required: true,
    },

    currency: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

budgetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type Budget = InferSchemaType<typeof budgetSchema>;
export type BudgetDocument = HydratedDocument<Budget>;

export const BudgetCollection = model<Budget>('budgets', budgetSchema);
