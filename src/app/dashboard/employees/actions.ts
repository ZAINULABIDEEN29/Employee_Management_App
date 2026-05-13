'use server';

import dbConnect from '@/lib/mongodb';
import Employee from '@/models/Employee';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function createEmployee(formData: FormData) {
  try {
    await dbConnect();
    
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      employeeId: formData.get('employeeId'),
      department: formData.get('department'),
      position: formData.get('position'),
      salary: Number(formData.get('salary')),
      status: formData.get('status'),
      joinDate: formData.get('joinDate'),
      passwordHash: await bcrypt.hash('password123', 10), // Default password
    };

    await Employee.create(data);
    revalidatePath('/dashboard/employees');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateEmployee(id: string, formData: FormData) {
  try {
    await dbConnect();
    
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      employeeId: formData.get('employeeId'),
      department: formData.get('department'),
      position: formData.get('position'),
      salary: Number(formData.get('salary')),
      status: formData.get('status'),
      joinDate: formData.get('joinDate'),
    };

    await Employee.findByIdAndUpdate(id, data);
    revalidatePath('/dashboard/employees');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteEmployee(id: string) {
  try {
    await dbConnect();
    await Employee.findByIdAndDelete(id);
    revalidatePath('/dashboard/employees');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
