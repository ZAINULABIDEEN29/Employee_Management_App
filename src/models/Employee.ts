import mongoose, { Schema, Document } from 'mongoose';

export interface ISalaryRecord {
  amount: number;
  effectiveDate: Date;
  reason?: string;
}

export interface IEmployee extends Document {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: 'Employee';
  phone: string;
  department: mongoose.Types.ObjectId;
  position: string;
  salary: number;
  salaryHistory: ISalaryRecord[];
  status: 'Active' | 'Inactive' | 'On Leave';
  joinDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema: Schema = new Schema(
  {
    employeeId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'Employee' },
    phone: { type: String, required: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true },
    salaryHistory: [
      {
        amount: { type: Number, required: true },
        effectiveDate: { type: Date, default: Date.now },
        reason: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'On Leave'],
      default: 'Active',
    },
    joinDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);
