// models/QuestionSetModel.ts
import mongoose from "mongoose";

const questionSetSchema = new mongoose.Schema({
  video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
  segmentIndex: { type: Number, required: true },
  segmentText: { type: String, required: true },
  questions: [{ type: String, required: true }],
});

export const QuestionSet = mongoose.model("QuestionSet", questionSetSchema);
