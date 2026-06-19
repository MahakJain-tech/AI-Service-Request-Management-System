const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const ticketRoutes = require('./routes/ticketRoutes');
const Ticket = require('./models/Ticket');
const Employee = require('./models/Employee');
const Customer = require('./models/Customer');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve API Routes
app.use('/api', ticketRoutes);

// Static frontend serving
// This serves all frontend files directly from the "frontend" directory or workspace root
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../')));

// Root route redirects to landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Seed Initial Data function
const seedData = async () => {
  try {
    const ticketCount = await Ticket.countDocuments();
    if (ticketCount === 0) {
      console.log('Seeding database with default tickets...');
      const mockTickets = [
        {
          ticketId: 'REQ-1001',
          customerName: 'Sarah Mitchell',
          email: 'sarah@techcorp.com',
          product: 'NexusCloud Enterprise',
          priority: 'urgent',
          category: 'technical',
          issueDescription: 'Hi, I have been trying to reset my password for the past 2 hours but I keep getting an error saying the reset link has expired. Please help ASAP.',
          status: 'open',
          assignedAgent: 'Unassigned',
          resolutionTimeline: '2 hours'
        },
        {
          ticketId: 'REQ-1002',
          customerName: 'James Rodriguez',
          email: 'james@dataflow.com',
          product: 'NexusCRM Enterprise Suite',
          priority: 'high',
          category: 'billing',
          issueDescription: 'Hello, I noticed that my November invoice shows a charge of $450 for the Enterprise plan but we downgraded to Professional in October.',
          status: 'open',
          assignedAgent: 'Unassigned',
          resolutionTimeline: '24 hours'
        },
        {
          ticketId: 'REQ-1003',
          customerName: 'Priya Sharma',
          email: 'priya@cloudbase.com',
          product: 'NexusAPI Portal',
          priority: 'urgent',
          category: 'technical',
          issueDescription: 'After the latest update pushed yesterday, our API integration has completely stopped working. We get 401 unauthorized errors.',
          status: 'open',
          assignedAgent: 'Unassigned',
          resolutionTimeline: '4 hours'
        },
        {
          ticketId: 'REQ-1004',
          customerName: 'Michael Chen',
          email: 'michael@startuphub.io',
          product: 'NexusCRM Professional',
          priority: 'medium',
          category: 'feature',
          issueDescription: 'We have recently onboarded a new team of 50+ people and manually adding each user is time-consuming. Need bulk user import.',
          status: 'in-progress',
          assignedAgent: 'Lisa Park',
          resolutionTimeline: '72 hours'
        },
        {
          ticketId: 'REQ-1005',
          customerName: 'Emma Wilson',
          email: 'emma@retailmax.com',
          product: 'NexusCRM Starter',
          priority: 'low',
          category: 'account',
          issueDescription: 'We have moved our office and need to update the billing address on file for all future invoices.',
          status: 'closed',
          assignedAgent: 'David Thompson',
          resolutionTimeline: 'Completed'
        }
      ];
      await Ticket.insertMany(mockTickets);
      console.log('Seeding completed successfully!');
    }

    const employeeCount = await Employee.countDocuments();
    if (employeeCount === 0) {
      await Employee.create([
        { name: 'Lisa Park', email: 'lisa@mediagroup.com', role: 'Support Agent', department: 'Customer Support' },
        { name: 'David Thompson', email: 'david@financefirst.com', role: 'Support Agent', department: 'Customer Support' },
        { name: 'Emma Watson', email: 'emma.w@nexuscrm.com', role: 'Admin', department: 'Operations' }
      ]);
      console.log('Seeding employees...');
    }

    const customerCount = await Customer.countDocuments();
    if (customerCount === 0) {
      await Customer.create([
        { name: 'Sarah Mitchell', email: 'sarah@techcorp.com', company: 'TechCorp Inc', accountType: 'Enterprise' },
        { name: 'James Rodriguez', email: 'james@dataflow.com', company: 'DataFlow LLC', accountType: 'Enterprise' },
        { name: 'Priya Sharma', email: 'priya@cloudbase.com', company: 'CloudBase Solutions', accountType: 'Enterprise' }
      ]);
      console.log('Seeding customers...');
    }

  } catch (error) {
    console.error('Error seeding database: ', error);
  }
};

// Run Seeder
seedData();

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`   NexusCRM Server running on http://localhost:${PORT}`);
  console.log(`====================================================`);
});
