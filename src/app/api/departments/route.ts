import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Department from '@/models/Department';

export async function GET() {
  try {
    await dbConnect();
    
    const departments = await Department.aggregate([
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: 'department',
          as: 'employees'
        }
      },
      {
        $project: {
          name: 1,
          description: 1,
          employeeCount: { $size: '$employees' }
        }
      },
      { $sort: { name: 1 } }
    ]);

    return NextResponse.json(departments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const department = await Department.create(body);
    return NextResponse.json(department, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
