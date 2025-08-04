import mongoose, { Document, Schema } from "mongoose";

export interface IComponent extends Document {
  _id: mongoose.Types.ObjectId;
  category: string;
  componentName: string;
  manufacturer: string;
  partNumber: string;
  description: string;
  quantity: number;
  location: string;
  unitPrice: number;
  criticalLowThreshold: number;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const componentSchema = new Schema<IComponent>(
  {
    category: { type: String, required: true },
    componentName: { type: String, required: true },
    manufacturer: { type: String, required: true },
    partNumber: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    location: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    criticalLowThreshold: { type: Number, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Component = mongoose.model<IComponent>("Component", componentSchema);
export default Component;
