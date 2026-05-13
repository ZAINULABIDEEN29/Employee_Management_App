import React from 'react';
import dbConnect from '@/lib/mongodb';
import Employee from '@/models/Employee';
import Department from '@/models/Department';
import EmployeeClient from './EmployeeClient';

async function getEmployees(searchParams: any) {
  await dbConnect();
  
  const search = searchParams.search || '';
  const department = searchParams.department || '';
  const status = searchParams.status || '';
  const page = parseInt(searchParams.page || '1');
  const limit = 10;
  const skip = (page - 1) * limit;

  const query: any = {};
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { employeeId: { $regex: search, $options: 'i' } },
    ];
  }
  if (department) query.department = department;
  if (status) query.status = status;

  const [employees, total] = await Promise.all([
    Employee.find(query)
      .populate('department', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Employee.countDocuments(query),
  ]);

  return {
    employees: JSON.parse(JSON.stringify(employees)),
    total,
    pages: Math.ceil(total / limit) || 1,
    currentPage: page
  };
}

async function getDepartments() {
  await dbConnect();
  const departments = await Department.find().sort({ name: 1 }).lean();
  return JSON.parse(JSON.stringify(departments));
}

export default async function EmployeesPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  const [{ employees, total, pages, currentPage }, departments] = await Promise.all([
    getEmployees(resolvedSearchParams),
    getDepartments()
  ]);

  return (
    <EmployeeClient 
      employees={employees}
      departments={departments}
      total={total}
      pages={pages}
      currentPage={currentPage}
      searchParams={resolvedSearchParams}
    />
  );
}
