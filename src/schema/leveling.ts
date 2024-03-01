import { Schema, model } from "mongoose";

interface ILevelingModel {
  userId: string;
  level: number;
  xp: number;
  totalXpNeeded: number;
}

const schema = new Schema<ILevelingModel>({
  userId: {
    required: true,
    type: String,
  },
  level: {
    default: 0,
    type: Number,
  },
  xp: {
    default: 0,
    type: Number,
  },
  totalXpNeeded: {
    default: 100,
    type: Number,
  },
});

export const LevelingModel = model<ILevelingModel>("leveling", schema);
