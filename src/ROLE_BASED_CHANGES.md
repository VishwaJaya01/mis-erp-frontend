# Role-Based Behavior Changes - LPG Engineering ERP

## Summary of Changes Made

### ✅ Completed Changes:

1. **Router (lib/router.tsx)** - DONE
   - Removed "admin" page from routing
   - Added RolePermissions interface with all required permissions
   - Created getPermissions() function for Employee, Supervisor, Manager only
   - Removed Admin and HR role references

2. **Sidebar (components/layout/Sidebar.tsx)** - DONE
   - Employee: Home, Work, People
   - Supervisor: Home, Orders, Work, People
   - Manager: Home, Orders, Work, People
   - Removed Admin from navigation entirely

3. **App.tsx** - DONE
   - Removed Admin page import and route
   - Only routes to: login, home, orders, work, people

4. **Orders Page (components/pages/Orders.tsx)** - PARTIALLY DONE
   - Added "Read-only" badge for Employee role
   - Hidden "New Order" and "Export CSV" buttons for non-Managers
   - Uses permissions.canCreateOrder

### 🔄 Still Needed (implement when continuing):

#### Orders Page - Drawer Actions:
- **Quote Tab**: Hide "Send Quote", "Save as Draft", "Approve for Production" if !permissions.canEditQuote
- **Files Tab**: Show upload only if userRole !== "Employee"  
- **Timeline Tab**: Show "Add note" only if userRole !== "Employee"
- **Row Actions Menu**: Hide Edit/Duplicate/Cancel if userRole === "Employee"

#### Work Page (components/pages/Work.tsx):
- **Tabs Visibility**:
  - Employee: Show "My Tasks" and "Time" tabs only
  - Supervisor/Manager: Show all tabs (My Tasks, All Jobs, Time)
- **All Jobs Tab**: Hide if !permissions.canSeeAllJobs
- **Time Tab - Review Section**: Hide if !permissions.canReviewTime

#### People Page (components/pages/People.tsx):
- **Approvals Tab**: Hide entirely if !permissions.canSeeLeaveApprovals (Employee)
- **Team Tab Actions**: Employee = read-only, hide management actions

#### Login Page (components/pages/Login.tsx):
- Already supports Employee | Supervisor | Manager roles
- No changes needed

#### Home Page (components/pages/Home.tsx):
- Already has role variants for Employee | Supervisor | Manager
- No changes needed - already correct

#### Admin Page (components/pages/Admin.tsx):
- Mark as OUT OF SCOPE
- Not accessible via navigation
- Could be deleted or kept for future use

## Role Permissions Matrix

| Permission | Employee | Supervisor | Manager |
|-----------|----------|------------|---------|
| canCreateOrder | ❌ | ❌ | ✅ |
| canEditQuote | ❌ | ❌ | ✅ |
| canApproveQuoteToProduction | ❌ | ❌ | ✅ |
| canViewOrders | ✅ (read-only) | ✅ | ✅ |
| canSeeAllJobs | ❌ | ✅ | ✅ |
| canReviewTime | ❌ | ✅ | ✅ |
| canSeeLeaveApprovals | ❌ | ✅ | ✅ |
| showAnnouncements | ✅ | ✅ | ✅ |

## Test Credentials (for annotations)

- employee@lpgeng.lk → Employee role
- supervisor@lpgeng.lk → Supervisor role  
- manager@lpgeng.lk → Manager role

## Implementation Notes

### Code Pattern for Gating:
```tsx
// Hide feature
{permissions.canCreateOrder && (
  <Button>New Order</Button>
)}

// Disable feature with tooltip
<Button 
  disabled={!permissions.canEditQuote}
  onClick={() => !permissions.canEditQuote && toast.error("You don't have permission")}
>
  Edit Quote
</Button>

// Read-only indicator
{userRole === "Employee" && (
  <Badge variant="outline">Read-only</Badge>
)}
```

### Priority Order for Remaining Updates:
1. Work page - hide tabs based on role
2. People page - hide Approvals tab for Employee
3. Orders page - complete drawer action gating
4. Final testing of all role flows
