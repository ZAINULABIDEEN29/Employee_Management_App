import dbConnect from './mongodb';
import Department from '../models/Department';
import Employee from '../models/Employee';
import Admin from '../models/Admin';
import bcrypt from 'bcryptjs';

const departments = [
  { name: 'Engineering', description: 'Software development and infrastructure.' },
  { name: 'Marketing', description: 'Brand awareness and lead generation.' },
  { name: 'Human Resources', description: 'Talent acquisition and employee well-being.' },
  { name: 'Legal', description: 'Compliance and legal affairs.' },
  { name: 'Design', description: 'Product design and user experience.' },
];

export async function seedDatabase() {
  await dbConnect();

  // Clear existing data
  await Department.deleteMany({});
  await Employee.deleteMany({});
  await Admin.deleteMany({});

  // Hash password
  const passwordHash = await bcrypt.hash('123456', 10);

  // Seed Departments
  const createdDepts = await Department.insertMany(departments);

  // Seed Admin
  await Admin.create({
    name: 'Admin User',
    email: 'admin@ems.com',
    passwordHash: passwordHash,
    role: 'SuperAdmin',
  });

  // Seed Employees
  const employees = [
    {
      employeeId: 'EMP001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      passwordHash: passwordHash,
      role: 'Employee',
      phone: '123-456-7890',
      department: createdDepts[0]._id,
      position: 'Senior Developer',
      salary: 85000,
      status: 'Active',
      joinDate: new Date('2023-01-15'),
    },
    {
      employeeId: 'EMP002',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      passwordHash: passwordHash,
      role: 'Employee',
      phone: '123-456-7891',
      department: createdDepts[1]._id,
      position: 'Marketing Manager',
      salary: 75000,
      status: 'Active',
      joinDate: new Date('2023-03-10'),
    },
    {
      employeeId: 'EMP003',
      firstName: 'Mike',
      lastName: 'Ross',
      email: 'mike@example.com',
      passwordHash: passwordHash,
      role: 'Employee',
      phone: '123-456-7892',
      department: createdDepts[3]._id,
      position: 'Legal Associate',
      salary: 65000,
      status: 'On Leave',
      joinDate: new Date('2023-05-22'),
    },
  ];

  await Employee.insertMany(employees);

  console.log('Database seeded successfully!');
}
