import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITranscript extends Document {
  video: Types.ObjectId;   // Reference to Video
  transcriptText: string;
  createdAt: Date;
}

const TranscriptSchema = new Schema<ITranscript>({
  video: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
  transcriptText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Transcript = mongoose.model<ITranscript>('Transcript', TranscriptSchema);
