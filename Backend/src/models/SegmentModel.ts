// models/QuestionSetModel.ts
import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  label: { type: String, required: true }, // e.g. 'A'
  text: { type: String, required: true },
});

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [optionSchema],
  answer: { type: String, required: true }, // e.g. 'B'
});

const questionSetSchema = new mongoose.Schema({
  video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
  segmentIndex: { type: Number, required: true },
  segmentText: { type: String, required: true },
  questions: [questionSchema],
});

export const QuestionSet = mongoose.model("QuestionSet", questionSetSchema);
