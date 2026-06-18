# NexusCRM - Enterprise CRM & Service Request Management System

NexusCRM is an interactive, enterprise-grade CRM and Service Request Management portal designed specifically to solve support bottlenecks. The platform features an intelligent **AI Draft Studio** that automatically drafts email replies based on past customer requests, allowing support agents to review, edit, and send responses in seconds.

This project is built as a highly responsive, modern, dark-themed web application optimized for desktop and mobile presentations.

## 🚀 Key Features

### 🏢 Support Agent Workspace (`dashboard.html`)
- **Three-Panel Inbox Layout**: Easily browse active tickets, inspect detailed request parameters, and draft responses in one view.
- **NexusAI Draft Studio**: Simulates natural language processing (NLP) to auto-generate response drafts based on request category (Technical, Billing, Account, Feature).
- **Interactive Kanban Board**: Drag-and-drop workflow tracking (Open ➔ In Progress ➔ Resolved).
- **Embedded Analytics**: Live breakdown charts and response metrics powered by Chart.js.

### 👥 Customer Portal (`user-portal.html`)
- **Request Submission**: Drag-and-drop file attachment simulator, character counters, and dynamic validation.
- **Interactive Ticket Tracking**: 5-step status stepper showing live state updates (Submitted ➔ Under Review ➔ Processing ➔ Response Sent ➔ Resolved).
- **Star Rating Feedback System**: Animated customer satisfaction rating tool.
- **Data Persistence**: Uses browser `localStorage` to save submitted tickets and customer feedback.

### 🔐 Interactive Gateway (`login.html`)
- Split-screen visual layout with role-switching tabs (Agent login vs. Customer login).
- Fast credentials autofill buttons for quick assessment during evaluations.

---

## 🛠️ Technology Stack
- **Structure**: Semantic HTML5
- **Styling**: Tailwind CSS (via CDN) with customized color tokens for dark mode theme
- **Icons**: FontAwesome v6
- **Charts & Graphs**: Chart.js
- **Animations**: Canvas Confetti (CDN) and Tailwind transition utilities

---

## 🔑 Demo Credentials
To navigate the system, use the quick-fill buttons on the login page or manually enter:

| Role | Email | Password | Target Page |
| :--- | :--- | :--- | :--- |
| **Support Agent** | `agent@nexuscrm.com` | `agent123` | `dashboard.html` |
| **Customer** | `user@example.com` | `user123` | `user-portal.html` |

---

## 📁 Project Structure
```text
crm_project/
├── index.html          # Main landing page & showcase
├── login.html          # Role-based split login page
├── dashboard.html      # Agent CRM workspace & AI email draft engine
├── user-portal.html    # Customer ticket creation and tracking system
└── README.md           # Project documentation
```

*Note: All images, charts, and AI text generators run natively in the browser console/environment, requiring no backend setup or API key keys.*
