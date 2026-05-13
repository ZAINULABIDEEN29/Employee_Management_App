'use server';

import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Payroll from '@/models/Payroll';
import { revalidatePath } from 'next/cache';

export async function releaseSalary(employeeId: string, month: string, baseSalary: number, bonus: number, deductions: number) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== 'SuperAdmin') {
    return { success: false, error: 'Unauthorized' };
  }

  await dbConnect();

  try {
    const netSalary = baseSalary + bonus - deductions;

    const payroll = await Payroll.create({
      employee: employeeId,
      month,
      baseSalary,
      bonus,
      deductions,
      netSalary,
      status: 'Paid',
      paymentDate: new Date()
    });

    revalidatePath('/dashboard/payroll');
    revalidatePath('/employee/salary');
    return { success: true, data: JSON.parse(JSON.stringify(payroll)) };
  } catch (error: any) {
    if (error.code === 11000) {
      return { success: false, error: `Salary for ${month} has already been released for this employee.` };
    }
    return { success: false, error: error.message };
  }
}
