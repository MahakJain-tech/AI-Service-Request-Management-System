const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  product: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['technical', 'billing', 'account', 'feature'],
    required: true
  },
  issueDescription: {
    type: String,
    required: true,
    minlength: 15
  },
  attachmentName: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'closed'],
    default: 'open'
  },
  assignedAgent: {
    type: String,
    default: 'Unassigned'
  },
  resolutionTimeline: {
    type: String,
    default: '48 hours'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-generate ticketId (e.g., REQ-1001, REQ-1002, etc.) if not present
TicketSchema.pre('save', async function (next) {
  if (!this.ticketId) {
    try {
      // Find the count of existing documents to generate a unique incremental request code
      const count = await mongoose.model('Ticket').countDocuments();
      const nextNum = 1001 + count;
      this.ticketId = `REQ-${nextNum}`;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model('Ticket', TicketSchema);
