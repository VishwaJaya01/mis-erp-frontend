# LPG Engineering ERP System

A comprehensive Enterprise Resource Planning (ERP) system built for LPG Engineering with React, TypeScript, and Tailwind CSS.

## Features

### 01. Login Page
- Email and password authentication
- Form validation with inline error messages
- Password show/hide toggle
- Remember me option
- Password recovery modal
- SSO options (Google, Microsoft)
- Role-based login routing

### 02. Home Dashboard (Role Variants)
Three different variants based on user role:

**Employee View:**
- My Tasks list with status tracking
- Quick Time Log with timer
- Today/This Week task filters
- Task time tracking

**Supervisor View:**
- Team Workload visualization (bar chart)
- Pending Time Approvals table
- Today's Tasks overview
- Approve/Reject time entries

**Manager View:**
- KPI cards (Orders by status, Revenue MTD, On-time completion %, Open quotes)
- Quick Actions (Create Order, Assign Task, Generate Report)
- Recent Orders table
- Tasks due soon list

**All Roles:**
- Announcements panel with recent updates
- Personalized greeting and date

### 03. Orders (List + Drawer)
- Stats strip showing order metrics
- Advanced filtering (Status, Type, Date range)
- Orders table with sortable columns
- Row selection and bulk actions
- Order details drawer with tabs:
  - Details: Order info, customer, status
  - Quote: Line items, pricing, approval
  - Files: Document upload and management
  - Timeline: Activity history
- New order creation modal

### 04. Work (Tasks + Time)
**My Tasks Tab:**
- Task list with status, priority, due dates
- Inline timer controls
- Task creation and editing
- Linked orders and customers

**All Jobs Tab:**
- Kanban board view with drag & drop
- List view with data grid
- Status columns (Unassigned, In progress, QA, Completed)
- Bulk task operations

**Time Tab:**
- Timer mode with start/stop
- Manual time entry
- My Time Logs table with week selector
- Review Time section (for supervisors/managers)
- Submit, approve, reject time entries

### 05. People (Team · My Leave · Approvals)
**Team Tab:**
- Employee directory with grid/table views
- Search and filter by dept, status
- Employee profile drawer with:
  - Overview (contact info, manager, skills)
  - Leave balances and history
  - Notes

**My Leave Tab:**
- New leave request form (Annual, Casual, Medical, Unpaid)
- Leave balances display
- Leave policy notes
- Leave history table

**Approvals Tab:**
- Pending leave requests for managers
- Approve/Decline actions
- Bulk operations
- Status tracking

### 06. Admin & Settings
**Users Tab:**
- User management table
- Invite new users
- Import users via CSV
- Role and department assignment
- User status management

**Roles/Permissions Tab:**
- Role list sidebar
- Permission matrix (modules × actions)
- Granular permissions (Read, Create, Update, Delete, Approve, Export)
- Role metadata editing

**System Tab:**
- Organization settings
- Working time configuration
- Leave & holidays setup
- Security policies (password, 2FA, session timeout)
- Data export and audit log

**Profile Tab:**
- Personal information editing
- Password change
- User preferences (theme, date/time format)
- Avatar upload

## Technical Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Lucide React** - Icons
- **Sonner** - Toast notifications

## Component Structure

```
/components
├── layout/
│   ├── AppShell.tsx       - Main layout wrapper
│   ├── Sidebar.tsx        - Navigation sidebar
│   └── Topbar.tsx         - Top navigation bar
├── pages/
│   ├── Login.tsx          - Login page
│   ├── Home.tsx           - Dashboard with role variants
│   ├── Orders.tsx         - Orders management
│   ├── Work.tsx           - Tasks and time tracking
│   ├── People.tsx         - Team and leave management
│   └── Admin.tsx          - System administration
└── ui/                    - shadcn/ui components

/lib
└── router.tsx             - Custom routing context
```

## Navigation

The app uses a custom routing system with context. Navigation is handled through the sidebar menu:
- Dashboard → Home page (role-specific)
- Orders → Order management
- Work → Tasks and time tracking
- People → Team and leave management
- Admin → System settings

## Role-Based Access

The system supports different user roles with varying permissions:
- **Employee** - Access to own tasks and time logging
- **Supervisor** - Team oversight, time approval
- **Manager** - Full dashboard, order management, team oversight
- **HR** - People management, leave approvals
- **Admin** - System configuration and user management

## Login Credentials (Demo)

Use any email format to test different roles:
- `employee@lpgeng.lk` → Employee role
- `supervisor@lpgeng.lk` → Supervisor role
- `manager@lpgeng.lk` or `admin@lpgeng.lk` → Manager role

Password: Any non-empty value

## Key Features

✅ Fully responsive design
✅ Role-based UI variants
✅ Interactive components (modals, drawers, sheets)
✅ Form validation
✅ Toast notifications
✅ Data tables with sorting and filtering
✅ Kanban board with drag-and-drop ready
✅ Time tracking with timer
✅ Document upload placeholders
✅ Permission matrix
✅ Audit logging
✅ Mock data for demonstration
