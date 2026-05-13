import mongoose, { Schema, Document } from 'mongoose';

export interface IPayroll extends Document {
  employee: mongoose.Types.ObjectId;
  month: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  status: 'Pending' | 'Paid';
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PayrollSchema: Schema = new Schema(
  {
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    month: { type: String, required: true },
    baseSalary: { type: Number, required: true },
    bonus: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Paid'], default: 'Paid' },
    paymentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

PayrollSchema.index({ employee: 1, month: 1 }, { unique: true });

export default mongoose.models.Payroll || mongoose.model<IPayroll>('Payroll', PayrollSchema);
