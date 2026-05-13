'use server';

import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Employee from '@/models/Employee';
import { revalidatePath } from 'next/cache';

export async function updatePersonalInfo(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, error: 'Unauthorized' };
  }

  await dbConnect();

  const phone = formData.get('phone');

  try {
    // Only allow updating non-critical personal info (e.g. Phone)
    // We do not allow employees to update their own Salary, Role, Email, or Department.
    await Employee.findOneAndUpdate(
      { email: session.user.email },
      { 
        $set: { 
          phone
        } 
      }
    );
    
    revalidatePath('/employee/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
