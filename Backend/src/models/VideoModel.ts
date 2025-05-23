import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
  filename: string;
  filepath: string;
  uploadedAt: Date;
}

const VideoSchema = new Schema<IVideo>({
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export const Video = mongoose.model<IVideo>('Video', VideoSchema);
