const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');
const Feedback = require('../models/Feedback');
const Customer = require('../models/Customer');

// ─── LOCAL IN-MEMORY MOCK DATABASE FALLBACKS ───
let inMemoryTickets = [
  {
    _id: "645d8b8e8f8f8f8f8f8f8f01",
    ticketId: 'REQ-1001',
    customerName: 'Sarah Mitchell',
    email: 'sarah@techcorp.com',
    product: 'NexusCloud Enterprise',
    priority: 'urgent',
    category: 'technical',
    issueDescription: 'Hi, I have been trying to reset my password for the past 2 hours but I keep getting an error saying the reset link has expired. Please help ASAP.',
    status: 'open',
    assignedAgent: 'Unassigned',
    resolutionTimeline: '2 hours',
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  },
  {
    _id: "645d8b8e8f8f8f8f8f8f8f02",
    ticketId: 'REQ-1002',
    customerName: 'James Rodriguez',
    email: 'james@dataflow.com',
    product: 'NexusCRM Enterprise Suite',
    priority: 'high',
    category: 'billing',
    issueDescription: 'Hello, I noticed that my November invoice shows a charge of $450 for the Enterprise plan but we downgraded to Professional in October.',
    status: 'open',
    assignedAgent: 'Unassigned',
    resolutionTimeline: '24 hours',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    _id: "645d8b8e8f8f8f8f8f8f8f03",
    ticketId: 'REQ-1003',
    customerName: 'Priya Sharma',
    email: 'priya@cloudbase.com',
    product: 'NexusAPI Portal',
    priority: 'urgent',
    category: 'technical',
    issueDescription: 'After the latest update pushed yesterday, our API integration has completely stopped working. We get 401 unauthorized errors.',
    status: 'open',
    assignedAgent: 'Unassigned',
    resolutionTimeline: '4 hours',
    createdAt: new Date(Date.now() - 28 * 60 * 1000).toISOString()
  },
  {
    _id: "645d8b8e8f8f8f8f8f8f8f04",
    ticketId: 'REQ-1004',
    customerName: 'Michael Chen',
    email: 'michael@startuphub.io',
    product: 'NexusCRM Professional',
    priority: 'medium',
    category: 'feature',
    issueDescription: 'We have recently onboarded a new team of 50+ people and manually adding each user is time-consuming. Need bulk user import.',
    status: 'in-progress',
    assignedAgent: 'Lisa Park',
    resolutionTimeline: '72 hours',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  {
    _id: "645d8b8e8f8f8f8f8f8f8f05",
    ticketId: 'REQ-1005',
    customerName: 'Emma Wilson',
    email: 'emma@retailmax.com',
    product: 'NexusCRM Starter',
    priority: 'low',
    category: 'account',
    issueDescription: 'We have moved our office and need to update the billing address on file for all future invoices.',
    status: 'closed',
    assignedAgent: 'David Thompson',
    resolutionTimeline: 'Completed',
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString()
  }
];

let inMemoryFeedback = [];

// Helper check for database connection status
const isDbConnected = () => mongoose.connection.readyState === 1;

// ─── TICKETS API ───

// GET /api/tickets - Fetch all tickets
router.get('/tickets', async (req, res) => {
  try {
    if (isDbConnected()) {
      const tickets = await Ticket.find().sort({ createdAt: -1 });
      res.json(tickets);
    } else {
      res.json(inMemoryTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tickets: ' + error.message });
  }
});

// GET /api/tickets/:id - Get ticket by ID or ticketId
router.get('/tickets/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const filter = [];
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        filter.push({ _id: req.params.id });
      }
      filter.push({ ticketId: req.params.id });
      
      let ticket = await Ticket.findOne({ $or: filter });
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }
      res.json(ticket);
    } else {
      const ticket = inMemoryTickets.find(t => t._id === req.params.id || t.ticketId === req.params.id);
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }
      res.json(ticket);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/tickets - Create a new service request ticket
router.post('/tickets', async (req, res) => {
  try {
    const { customerName, email, product, priority, category, issueDescription, attachmentName } = req.body;
    
    // Server-side validation
    if (!customerName || !email || !product || !category || !issueDescription) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    
    if (isDbConnected()) {
      // Dynamically calculate sequential Ticket ID
      const count = await Ticket.countDocuments();
      const generatedTicketId = `REQ-${1001 + count}`;

      const newTicket = new Ticket({
        ticketId: generatedTicketId,
        customerName,
        email,
        product,
        priority: priority || 'medium',
        category,
        issueDescription,
        attachmentName: attachmentName || null
      });
      
      const savedTicket = await newTicket.save();
      
      // Auto-create Customer in database if it doesn't exist already to satisfy ERD flow
      const customerExists = await Customer.findOne({ email });
      if (!customerExists) {
        await Customer.create({
          name: customerName,
          email: email,
          company: 'Independent Client',
          accountType: 'Professional'
        });
      }

      res.status(201).json(savedTicket);
    } else {
      const generatedTicketId = `REQ-${1001 + inMemoryTickets.length}`;
      const mockId = "mock-" + Math.random().toString(36).substring(2, 11);
      const newTicket = {
        _id: mockId,
        ticketId: generatedTicketId,
        customerName,
        email,
        product,
        priority: priority || 'medium',
        category,
        issueDescription,
        attachmentName: attachmentName || null,
        status: 'open',
        assignedAgent: 'Unassigned',
        resolutionTimeline: '48 hours',
        createdAt: new Date().toISOString()
      };
      inMemoryTickets.push(newTicket);
      res.status(201).json(newTicket);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ticket: ' + error.message });
  }
});

// PUT /api/tickets/:id - Update status / priority / details of a ticket
router.put('/tickets/:id', async (req, res) => {
  try {
    const { status, priority, assignedAgent, resolutionTimeline, issueDescription } = req.body;
    
    if (isDbConnected()) {
      const updateData = {};
      if (status) updateData.status = status;
      if (priority) updateData.priority = priority;
      if (assignedAgent) updateData.assignedAgent = assignedAgent;
      if (resolutionTimeline) updateData.resolutionTimeline = resolutionTimeline;
      if (issueDescription) updateData.issueDescription = issueDescription;
      updateData.updatedAt = Date.now();

      const filter = [];
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        filter.push({ _id: req.params.id });
      }
      filter.push({ ticketId: req.params.id });

      const updatedTicket = await Ticket.findOneAndUpdate(
        { $or: filter },
        updateData,
        { new: true }
      );

      if (!updatedTicket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }
      res.json(updatedTicket);
    } else {
      const ticket = inMemoryTickets.find(t => t._id === req.params.id || t.ticketId === req.params.id);
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }
      if (status) ticket.status = status;
      if (priority) ticket.priority = priority;
      if (assignedAgent) ticket.assignedAgent = assignedAgent;
      if (resolutionTimeline) ticket.resolutionTimeline = resolutionTimeline;
      if (issueDescription) ticket.issueDescription = issueDescription;
      ticket.updatedAt = new Date().toISOString();
      res.json(ticket);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ticket: ' + error.message });
  }
});

// DELETE /api/tickets/:id - Delete a ticket
router.delete('/tickets/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const filter = [];
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        filter.push({ _id: req.params.id });
      }
      filter.push({ ticketId: req.params.id });

      const deletedTicket = await Ticket.findOneAndDelete({ $or: filter });
      
      if (!deletedTicket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }
      res.json({ message: 'Ticket deleted successfully', ticket: deletedTicket });
    } else {
      const index = inMemoryTickets.findIndex(t => t._id === req.params.id || t.ticketId === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: 'Ticket not found' });
      }
      const deletedTicket = inMemoryTickets.splice(index, 1)[0];
      res.json({ message: 'Ticket deleted successfully', ticket: deletedTicket });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete ticket: ' + error.message });
  }
});

// ─── FEEDBACKS API ───

// POST /api/feedback - Create a customer feedback
router.post('/feedback', async (req, res) => {
  try {
    const { ticketId, customerName, rating, comments } = req.body;
    if (!ticketId || !customerName || !rating) {
      return res.status(400).json({ error: 'Ticket ID, Name, and Rating are required' });
    }
    
    if (isDbConnected()) {
      const feedback = new Feedback({ ticketId, customerName, rating, comments });
      const savedFeedback = await feedback.save();
      res.status(201).json(savedFeedback);
    } else {
      const feedback = {
        _id: "fb-" + Math.random().toString(36).substring(2, 11),
        ticketId,
        customerName,
        rating,
        comments,
        submittedAt: new Date().toISOString()
      };
      inMemoryFeedback.push(feedback);
      res.status(201).json(feedback);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to save feedback: ' + error.message });
  }
});

// GET /api/feedback - Fetch all feedback
router.get('/feedback', async (req, res) => {
  try {
    if (isDbConnected()) {
      const feedbacks = await Feedback.find().sort({ submittedAt: -1 });
      res.json(feedbacks);
    } else {
      res.json(inMemoryFeedback.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
