import React from 'react';
import { Building2, Plus, Edit2, Trash2, Users } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Department from '@/models/Department';

async function getDepartments() {
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

  return JSON.parse(JSON.stringify(departments));
}

export default async function DepartmentsPage() {
  const departments = await getDepartments();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Manage your organization's structure and units.</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.length > 0 ? departments.map((dept: any) => (
          <div key={dept._id} className="card group hover:border-[var(--primary)] transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[var(--muted)] text-[var(--primary)] rounded-xl group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-[var(--background)] rounded-lg text-[var(--muted-foreground)] hover:text-[var(--primary)]">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-[var(--background)] rounded-lg text-[var(--muted-foreground)] hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{dept.name}</h3>
              <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">{dept.description || 'No description provided.'}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Users className="w-4 h-4 text-[var(--muted-foreground)]" />
                <span>{dept.employeeCount} Employees</span>
              </div>
              <button className="text-[var(--primary)] text-sm font-semibold hover:underline">View Members</button>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-12 text-center card text-[var(--muted-foreground)]">
            No departments found. Click "Add Department" to get started.
          </div>
        )}

        {/* Add Department Placeholder */}
        <button className="border-2 border-dashed border-[var(--border)] rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all group">
          <div className="w-12 h-12 rounded-full bg-[var(--muted)] flex items-center justify-center group-hover:bg-[var(--primary)]/10">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-semibold">Create New Department</span>
        </button>
      </div>
    </div>
  );
}
