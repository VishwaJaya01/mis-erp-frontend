import { useState } from 'react';
import { AppShell } from '../layout/AppShell';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Separator } from '../ui/separator';
import {
  Search,
  UserPlus,
  Upload,
  MoreVertical,
  Shield,
  Settings as SettingsIcon,
  User,
  Download,
  Loader2,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Checkbox } from '../ui/checkbox';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';
import { Textarea } from '../ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';

const mockUsers = [
  {
    id: 'U1',
    name: 'Nuwan',
    email: 'nuwan@lpgeng.lk',
    role: 'Supervisor',
    dept: 'Production',
    status: 'Active',
    lastActive: '2 mins ago',
  },
  {
    id: 'U2',
    name: 'Jayani',
    email: 'jayani@lpgeng.lk',
    role: 'Employee',
    dept: 'QA',
    status: 'Active',
    lastActive: '5 mins ago',
  },
  {
    id: 'U3',
    name: 'Imesh',
    email: 'imesh@lpgeng.lk',
    role: 'Employee',
    dept: 'IT',
    status: 'Active',
    lastActive: '1 hour ago',
  },
  {
    id: 'U4',
    name: 'Tharushi',
    email: 'tharushi@lpgeng.lk',
    role: 'HR',
    dept: 'HR',
    status: 'Active',
    lastActive: '10 mins ago',
  },
  {
    id: 'U5',
    name: 'Kasun',
    email: 'kasun@lpgeng.lk',
    role: 'Employee',
    dept: 'Production',
    status: 'Active',
    lastActive: '3 hours ago',
  },
  {
    id: 'U6',
    name: 'Dinithi',
    email: 'dinithi@lpgeng.lk',
    role: 'Manager',
    dept: 'Sales',
    status: 'Active',
    lastActive: '1 day ago',
  },
];

const roles = [
  { id: 'admin', name: 'Admin', users: 1, description: 'Full system access' },
  {
    id: 'manager',
    name: 'Manager',
    users: 3,
    description: 'Manage orders and team',
  },
  {
    id: 'supervisor',
    name: 'Supervisor',
    users: 2,
    description: 'Supervise production and approve time',
  },
  {
    id: 'employee',
    name: 'Employee',
    users: 12,
    description: 'Basic access to tasks and time',
  },
  { id: 'hr', name: 'HR', users: 2, description: 'Manage people and leave' },
];

const modules = [
  'Orders',
  'Jobs',
  'Time',
  'People',
  'Announcements',
  'Reports',
  'Admin',
];
const permissions = ['Read', 'Create', 'Update', 'Delete', 'Approve', 'Export'];

export function Admin() {
  const [showInvite, setShowInvite] = useState(false);
  const [selectedRole, setSelectedRole] = useState('admin');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // User management filters
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userDeptFilter, setUserDeptFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');

  // Assign Task state
  const [showAssignTask, setShowAssignTask] = useState(false);
  const [selectedUserForTask, setSelectedUserForTask] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [assignTaskTitle, setAssignTaskTitle] = useState('');
  const [assignTaskDescription, setAssignTaskDescription] = useState('');
  const [assignTaskPriority, setAssignTaskPriority] = useState('');
  const [assignTaskDueDate, setAssignTaskDueDate] = useState('');
  const [assignTaskOrder, setAssignTaskOrder] = useState('');
  const [isAssigningTask, setIsAssigningTask] = useState(false);
  const [showAssignTaskValidation, setShowAssignTaskValidation] =
    useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'secondary'; // Success state (green)
      case 'Invited':
        return 'default'; // Warning/Pending state (blue)
      case 'Suspended':
        return 'destructive'; // Error state (red)
      case 'Deactivated':
        return 'outline'; // Neutral state (gray)
      default:
        return 'outline';
    }
  };

  const handleImportCSV = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.info('CSV import dialog would open here');
    } catch (error) {
      console.error('Import CSV error:', error);
      toast.error('Failed to import CSV. Please try again.');
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      switch (action) {
        case 'edit':
          toast.info(`Edit user ${userId}`);
          break;
        case 'suspend':
          toast.warning(`User ${userId} suspended`);
          break;
        case 'delete':
          toast.error(`User ${userId} deleted`);
          break;
        case 'resetPassword':
          toast.success(`Password reset email sent to user ${userId}`);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`User action ${action} error:`, error);
      toast.error(`Failed to perform action. Please try again.`);
    }
  };

  const handleOpenAssignTask = (userId: string, userName: string) => {
    console.log('handleOpenAssignTask called with:', { userId, userName });
    setSelectedUserForTask({ id: userId, name: userName });
    setShowAssignTask(true);
    setShowAssignTaskValidation(false);
  };

  const handleCloseAssignTask = () => {
    setShowAssignTask(false);
    setSelectedUserForTask(null);
    setAssignTaskTitle('');
    setAssignTaskDescription('');
    setAssignTaskPriority('');
    setAssignTaskDueDate('');
    setAssignTaskOrder('');
    setShowAssignTaskValidation(false);
  };

  const handleAssignTask = async () => {
    setShowAssignTaskValidation(true);

    // Validate required fields
    if (!assignTaskTitle.trim() || !assignTaskPriority || !assignTaskOrder) {
      toast.error(
        'Please fill in all required fields (Title, Priority, Order)'
      );
      return;
    }

    setIsAssigningTask(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success(
        `Task "${assignTaskTitle}" assigned to ${selectedUserForTask?.name} successfully`
      );
      handleCloseAssignTask();
    } catch (error) {
      console.error('Assign task error:', error);
      toast.error('Failed to assign task. Please try again.');
    } finally {
      setIsAssigningTask(false);
    }
  };

  const handleExportUsers = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Users exported to CSV');
    } catch (error) {
      console.error('Export users error:', error);
      toast.error('Failed to export users. Please try again.');
    }
  };

  const handleExportOrders = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Orders exported to CSV');
    } catch (error) {
      console.error('Export orders error:', error);
      toast.error('Failed to export orders. Please try again.');
    }
  };

  const handleExportAuditLog = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Audit log exported to CSV');
    } catch (error) {
      console.error('Export audit log error:', error);
      toast.error('Failed to export audit log. Please try again.');
    }
  };

  const handleSaveSystemSettings = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success('System settings saved successfully');
    } catch (error) {
      console.error('Save system settings error:', error);
      toast.error('Failed to save system settings. Please try again.');
    }
  };

  const handleDiscardSystemChanges = () => {
    toast.info('Changes discarded');
  };

  return (
    <AppShell activePage="admin" breadcrumbs={['Admin & Settings']}>
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles/Permissions</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, role..."
                  className="pl-9"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                />
              </div>
              <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                </SelectContent>
              </Select>
              <Select value={userDeptFilter} onValueChange={setUserDeptFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All departments</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="qa">QA</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="it">IT</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={userStatusFilter}
                onValueChange={setUserStatusFilter}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="invited">Invited</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleImportCSV}>
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button onClick={() => setShowInvite(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite User
              </Button>
            </div>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        {user.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.dept}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(user.status) as any}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastActive}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.id, 'edit')}
                          >
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUserAction(user.id, 'resetPassword')
                            }
                          >
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              console.log('Assign Task clicked!');
                              handleOpenAssignTask(user.id, user.name);
                            }}
                          >
                            Assign Task
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.id, 'suspend')}
                          >
                            Suspend User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.id, 'delete')}
                            className="text-destructive"
                          >
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Roles/Permissions Tab */}
        <TabsContent value="roles" className="space-y-4">
          <div className="grid grid-cols-4 gap-6">
            {/* Role List */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Roles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedRole === role.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{role.name}</span>
                      <span className="text-xs">{role.users}</span>
                    </div>
                    <p className="text-xs opacity-80">{role.description}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  New Role
                </Button>
              </CardContent>
            </Card>

            {/* Permission Matrix */}
            <Card className="col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      Permissions for{' '}
                      {roles.find((r) => r.id === selectedRole)?.name}
                    </CardTitle>
                    <CardDescription>
                      Configure what this role can do in each module
                    </CardDescription>
                  </div>
                  {hasUnsavedChanges && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setHasUnsavedChanges(false)}
                      >
                        Discard
                      </Button>
                      <Button
                        onClick={() => {
                          toast.success('Permissions saved');
                          setHasUnsavedChanges(false);
                        }}
                      >
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Module</TableHead>
                        {permissions.map((perm) => (
                          <TableHead key={perm} className="text-center">
                            {perm}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modules.map((module) => (
                        <TableRow key={module}>
                          <TableCell>{module}</TableCell>
                          {permissions.map((perm) => (
                            <TableCell key={perm} className="text-center">
                              <Checkbox
                                defaultChecked={selectedRole === 'admin'}
                                onCheckedChange={() =>
                                  setHasUnsavedChanges(true)
                                }
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Role Name</Label>
                    <Input
                      value={roles.find((r) => r.id === selectedRole)?.name}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={
                        roles.find((r) => r.id === selectedRole)?.description
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Organization Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Organization Name</Label>
                  <Input defaultValue="LPG Engineering" />
                </div>
                <div className="space-y-2">
                  <Label>Registration Number</Label>
                  <Input placeholder="PV 12345" />
                </div>
                <div className="space-y-2">
                  <Label>Default Timezone</Label>
                  <Select defaultValue="colombo">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="colombo">
                        Asia/Colombo (UTC+5:30)
                      </SelectItem>
                      <SelectItem value="dhaka">
                        Asia/Dhaka (UTC+6:00)
                      </SelectItem>
                      <SelectItem value="delhi">
                        Asia/Delhi (UTC+5:30)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select defaultValue="lkr">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lkr">
                        LKR - Sri Lankan Rupee
                      </SelectItem>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Week Starts On</Label>
                  <Select defaultValue="monday">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Working Time */}
            <Card>
              <CardHeader>
                <CardTitle>Working Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Work Week</Label>
                  <div className="flex gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                      (day) => (
                        <Button
                          key={day}
                          variant={
                            day !== 'Sat' && day !== 'Sun'
                              ? 'default'
                              : 'outline'
                          }
                          size="sm"
                          className="flex-1"
                        >
                          {day}
                        </Button>
                      )
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Hours Start</Label>
                    <Input type="time" defaultValue="08:00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Hours End</Label>
                    <Input type="time" defaultValue="17:00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>OT Threshold (hours/week)</Label>
                  <Input type="number" defaultValue="40" />
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Password Minimum Length</Label>
                  <Input type="number" defaultValue="8" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Number</Label>
                    <p className="text-sm text-muted-foreground">
                      Passwords must contain a number
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Special Character</Label>
                    <p className="text-sm text-muted-foreground">
                      Passwords must contain !@#$%
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>2FA Requirement</Label>
                  <Select defaultValue="optional">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="optional">Optional</SelectItem>
                      <SelectItem value="required">Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input type="number" defaultValue="30" />
                </div>
              </CardContent>
            </Card>

            {/* Data & Audit */}
            <Card>
              <CardHeader>
                <CardTitle>Data & Audit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm mb-2">Export Data</p>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={handleExportUsers}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Users CSV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={handleExportOrders}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Orders CSV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={handleExportAuditLog}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Audit Log CSV
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm mb-2">Recent Audit Entries</p>
                  <div className="space-y-1 text-xs">
                    <div className="p-2 bg-muted rounded">
                      <p>User login: nuwan@lpgeng.lk</p>
                      <p className="text-muted-foreground">2 mins ago</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p>Order created: #1045</p>
                      <p className="text-muted-foreground">1 hour ago</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p>Permission changed: Employee role</p>
                      <p className="text-muted-foreground">3 hours ago</p>
                    </div>
                  </div>
                  <Button variant="link" className="px-0 mt-2">
                    View full log
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Bar */}
          <div className="sticky bottom-0 bg-card border-t p-4 -mx-6 -mb-6 flex justify-end gap-2">
            <Button variant="outline" onClick={handleDiscardSystemChanges}>
              Discard Changes
            </Button>
            <Button onClick={handleSaveSystemSettings}>Save Settings</Button>
          </div>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl">N</AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue="Nuwan Perera" />
                </div>
                <div className="space-y-2">
                  <Label>Email (read-only)</Label>
                  <Input defaultValue="nuwan@lpgeng.lk" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue="+94 77 123 4567" />
                </div>
                <div className="space-y-2">
                  <Label>Role (read-only)</Label>
                  <Input defaultValue="Production Supervisor" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Department (read-only)</Label>
                  <Input defaultValue="Production" disabled />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input type="password" />
                  </div>
                  <Button
                    onClick={() =>
                      toast.success('Password changed successfully')
                    }
                  >
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select defaultValue="light">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select defaultValue="mdy">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Time Format</Label>
                    <Select defaultValue="12">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12-hour</SelectItem>
                        <SelectItem value="24">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Invite User Dialog */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>
              Send an invitation to join LPG Engineering
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="Enter full name" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="name@lpgeng.lk" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="qa">QA</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="it">IT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvite(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowInvite(false);
                toast.success('Invitation sent successfully');
              }}
            >
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Task Dialog */}
      <Dialog open={showAssignTask} onOpenChange={setShowAssignTask}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Task</DialogTitle>
            <DialogDescription>
              Create and assign a new task to {selectedUserForTask?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                Task Title <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="e.g., Complete material inspection"
                value={assignTaskTitle}
                onChange={(e) => setAssignTaskTitle(e.target.value)}
              />
              {showAssignTaskValidation && !assignTaskTitle.trim() && (
                <p className="text-xs text-destructive">
                  Task title is required
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Task description (optional)"
                value={assignTaskDescription}
                onChange={(e) => setAssignTaskDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Related Order <span className="text-destructive">*</span>
              </Label>
              <Select
                value={assignTaskOrder}
                onValueChange={setAssignTaskOrder}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="#1043">
                    Order #1043 - APEX Garments
                  </SelectItem>
                  <SelectItem value="#1044">
                    Order #1044 - Orion Tools
                  </SelectItem>
                  <SelectItem value="#1045">
                    Order #1045 - Ceylon Plastics
                  </SelectItem>
                  <SelectItem value="#1042">
                    Order #1042 - Lanka Industries
                  </SelectItem>
                </SelectContent>
              </Select>
              {showAssignTaskValidation && !assignTaskOrder && (
                <p className="text-xs text-destructive">
                  Please select an order
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Priority <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={assignTaskPriority}
                  onValueChange={setAssignTaskPriority}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                {showAssignTaskValidation && !assignTaskPriority && (
                  <p className="text-xs text-destructive">
                    Please select priority
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={assignTaskDueDate}
                  onChange={(e) => setAssignTaskDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseAssignTask}
              disabled={isAssigningTask}
            >
              Cancel
            </Button>
            <Button onClick={handleAssignTask} disabled={isAssigningTask}>
              {isAssigningTask ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                'Assign Task'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
