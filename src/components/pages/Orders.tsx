import { useState } from "react";
import { AppShell } from "../layout/AppShell";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Search, Download, Plus, MoreVertical, Upload, FileText, Trash2, Eye, Edit, Copy, Ban, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useRouter } from "../../lib/router";
import { useDebounce } from "../../lib/hooks";
import { formatDateShort } from "../../lib/dateUtils";
import { exportTableData } from "../../lib/exportUtils";
import { notify, notifyError } from "../../lib/notificationUtils";

const mockOrders = [
  { id: "#1043", customer: "APEX Garments", type: "Factory design", status: "Quoted", quote: "LKR 245,000", created: "Oct 12, 2025" },
  { id: "#1044", customer: "Orion Tools", type: "Customer model", status: "In production", quote: "LKR 1,150,000", created: "Oct 13, 2025" },
  { id: "#1045", customer: "Ceylon Plastics", type: "Factory design", status: "Draft", quote: "—", created: "Oct 14, 2025" },
  { id: "#1042", customer: "Lanka Industries", type: "Customer model", status: "Completed", quote: "LKR 890,000", created: "Oct 10, 2025" },
  { id: "#1041", customer: "Premier Manufacturing", type: "Factory design", status: "In production", quote: "LKR 520,000", created: "Oct 08, 2025" },
];

const mockFiles = [
  { name: "Technical_Drawing_v2.pdf", type: "PDF", uploadedBy: "Nuwan", date: "Oct 12, 2025", size: "2.4 MB" },
  { name: "Material_Specs.pdf", type: "PDF", uploadedBy: "Jayani", date: "Oct 13, 2025", size: "1.8 MB" },
  { name: "Site_Photo_1.jpg", type: "JPG", uploadedBy: "Imesh", date: "Oct 14, 2025", size: "3.2 MB" },
];

const mockTimeline = [
  { event: "Order created", user: "Kasun", date: "Oct 12, 2025 09:30 AM" },
  { event: "Quote saved as draft", user: "Nuwan", date: "Oct 12, 2025 11:15 AM" },
  { event: "Quote sent to customer", user: "Nuwan", date: "Oct 12, 2025 02:45 PM" },
  { event: "Customer approved quote", user: "System", date: "Oct 13, 2025 10:20 AM" },
  { event: "Moved to In production", user: "Jayani", date: "Oct 14, 2025 08:00 AM" },
];

export function Orders() {
  const { userRole, permissions } = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [showEditOrder, setShowEditOrder] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // New Order form state
  const [newOrderCustomer, setNewOrderCustomer] = useState("");
  const [newOrderType, setNewOrderType] = useState("factory");
  const [newOrderNotes, setNewOrderNotes] = useState("");

  // Edit Order form state
  const [editOrderCustomer, setEditOrderCustomer] = useState("");
  const [editOrderType, setEditOrderType] = useState("");
  const [editOrderStatus, setEditOrderStatus] = useState("");
  const [editOrderNotes, setEditOrderNotes] = useState("");

  // Validation and loading states
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [showNewOrderValidation, setShowNewOrderValidation] = useState(false);
  const [showEditOrderValidation, setShowEditOrderValidation] = useState(false);

  // Reset form when dialog closes
  const handleCloseNewOrder = () => {
    setShowNewOrder(false);
    setNewOrderCustomer("");
    setNewOrderType("factory");
    setNewOrderNotes("");
    setShowNewOrderValidation(false);
  };

  const handleCreateOrder = async () => {
    // Show validation messages
    setShowNewOrderValidation(true);

    // Validate required fields
    if (!newOrderCustomer || !newOrderType) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Simulate async operation
    setIsCreatingOrder(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Order created successfully");
      handleCloseNewOrder();
    } catch (error) {
      toast.error("Failed to create order");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleOpenEditOrder = () => {
    if (order) {
      setEditOrderCustomer(order.customer);
      setEditOrderType(order.type);
      setEditOrderStatus(order.status);
      setEditOrderNotes("");
      setShowEditOrder(true);
    }
  };

  const handleCloseEditOrder = () => {
    setShowEditOrder(false);
    setEditOrderCustomer("");
    setEditOrderType("");
    setEditOrderStatus("");
    setEditOrderNotes("");
    setShowEditOrderValidation(false);
  };

  const handleSaveEditOrder = async () => {
    // Show validation messages
    setShowEditOrderValidation(true);

    // Validate required fields
    if (!editOrderCustomer.trim()) {
      notifyError.validation("Customer name is required");
      return;
    }

    // Simulate async operation
    setIsSavingOrder(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      notify.updated("Order", selectedOrder || undefined);
      handleCloseEditOrder();
      setSelectedOrder(null);
    } catch (error) {
      notifyError.generic("update order");
    } finally {
      setIsSavingOrder(false);
    }
  };

  // Bulk action handlers
  const handleSelectAll = () => {
    if (selectedRows.length === filteredOrders.length) {
      setSelectedRows([]);
      toast.info("Deselected all orders");
    } else {
      setSelectedRows(filteredOrders.map(order => order.id));
      toast.success(`Selected ${filteredOrders.length} orders`);
    }
  };

  const handleToggleRow = (orderId: string) => {
    setSelectedRows(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkExport = async () => {
    if (selectedRows.length === 0) {
      notifyError.validation("Please select orders to export");
      return;
    }

    try {
      // Get selected orders
      const ordersToExport = mockOrders.filter(order => 
        selectedRows.includes(order.id)
      );

      // Define columns for export
      const columns = [
        { key: 'id' as const, label: 'Order ID' },
        { key: 'customer' as const, label: 'Customer' },
        { key: 'type' as const, label: 'Order Type' },
        { key: 'status' as const, label: 'Status' },
        { key: 'quote' as const, label: 'Quote Amount' },
        { key: 'created' as const, label: 'Created Date' },
      ];

      // Export as CSV
      exportTableData(
        ordersToExport,
        `orders-export-${new Date().toISOString().split('T')[0]}`,
        'csv',
        columns
      );
      
      notify.exported(selectedRows.length, 'order');
      setSelectedRows([]);
    } catch (error) {
      console.error("Bulk export error:", error);
      notifyError.generic("export orders");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      notifyError.validation("Please select orders to delete");
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      notify.bulkAction("Deleted", selectedRows.length, "order");
      setSelectedRows([]);
    } catch (error) {
      console.error("Bulk delete error:", error);
      notifyError.generic("delete orders");
    }
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedRows.length === 0) {
      notifyError.validation("Please select orders to update");
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      notify.statusChanged("order", newStatus, selectedRows.length);
      setSelectedRows([]);
    } catch (error) {
      console.error("Bulk status change error:", error);
      notifyError.generic("update order status");
    }
  };

  const handleExportAll = () => {
    try {
      if (filteredOrders.length === 0) {
        notifyError.validation("No orders to export");
        return;
      }

      // Define columns for export
      const columns = [
        { key: 'id' as const, label: 'Order ID' },
        { key: 'customer' as const, label: 'Customer' },
        { key: 'type' as const, label: 'Order Type' },
        { key: 'status' as const, label: 'Status' },
        { key: 'quote' as const, label: 'Quote Amount' },
        { key: 'created' as const, label: 'Created Date' },
      ];

      // Export filtered orders as CSV
      exportTableData(
        filteredOrders,
        `orders-${new Date().toISOString().split('T')[0]}`,
        'csv',
        columns
      );
      
      notify.exported(filteredOrders.length, 'order');
    } catch (error) {
      console.error("Export error:", error);
      notifyError.generic("export orders");
    }
  };

  const handleRowClick = (orderId: string) => {
    setSelectedOrder(orderId);
  };

  const handleCloseDrawer = () => {
    setSelectedOrder(null);
  };

  const order = mockOrders.find(o => o.id === selectedOrder);

  // Filter orders based on search term and filters
  // Filter orders based on search and filters
  const filteredOrders = mockOrders.filter(order => {
    const searchLower = debouncedSearchTerm.toLowerCase();
    const matchesSearch = (
      order.id.toLowerCase().includes(searchLower) ||
      order.customer.toLowerCase().includes(searchLower)
    );
    
    const matchesStatus = statusFilter === "all" || 
      order.status.toLowerCase() === statusFilter.toLowerCase() ||
      (statusFilter === "production" && order.status === "In production");
    
    const matchesType = typeFilter === "all" || 
      (typeFilter === "customer" && order.type === "Customer model") ||
      (typeFilter === "factory" && order.type === "Factory design");
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Quoted": return "default"; // Warning/Pending state (blue)
      case "In production": return "default"; // In progress state (blue)
      case "Completed": return "secondary"; // Success state (green)
      case "Draft": return "outline"; // Neutral state (gray)
      default: return "outline";
    }
  };

  return (
    <AppShell activePage="orders" breadcrumbs={["Orders"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1>Orders</h1>
            {userRole === "Employee" && (
              <Badge variant="outline" className="text-xs">Read-only</Badge>
            )}
          </div>
          {permissions.canCreateOrder && (
            <div className="flex gap-3">
              <Button 
                variant="ghost"
                onClick={handleExportAll}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={() => setShowNewOrder(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </div>
          )}
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>All Orders</CardDescription>
              <div className="text-2xl">124</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Quoted</CardDescription>
              <div className="text-2xl">18</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>In Production</CardDescription>
              <div className="text-2xl">32</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completed (30d)</CardDescription>
              <div className="text-2xl">45</div>
            </CardHeader>
          </Card>
        </div>

        {/* Filter Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-3 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search order # or customer"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search orders by order number or customer name"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48" aria-label="Filter orders by status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="quoted">Quoted</SelectItem>
                  <SelectItem value="production">In production</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48" aria-label="Filter orders by type">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="customer">Customer model</SelectItem>
                  <SelectItem value="factory">Factory design</SelectItem>
                </SelectContent>
              </Select>
              {selectedRows.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkExport}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export ({selectedRows.length})
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4 mr-2" />
                        Actions ({selectedRows.length})
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleBulkStatusChange("Quoted")}>
                        Mark as Quoted
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkStatusChange("In production")}>
                        Move to Production
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkStatusChange("Completed")}>
                        Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleBulkDelete}
                        className="text-destructive"
                      >
                        Delete Selected
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedRows.length === filteredOrders.length && filteredOrders.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quote</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleRowClick(order.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedRows.includes(order.id)}
                      onCheckedChange={() => handleToggleRow(order.id)}
                    />
                  </TableCell>
                  <TableCell className="font-mono">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.type}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(order.status) as any}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.quote}</TableCell>
                  <TableCell className="text-muted-foreground">{order.created}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRowClick(order.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View details
                        </DropdownMenuItem>
                        {userRole !== "Employee" && (
                          <>
                            <DropdownMenuItem onClick={() => toast.success(`Editing order ${order.id}`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.success(`Duplicated order ${order.id}`)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => toast.error(`Order ${order.id} cancelled`)}
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Cancel order
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No orders found matching your filters</p>
            </div>
          )}
        </Card>
      </div>

      {/* Order Drawer */}
      <Sheet open={!!selectedOrder} onOpenChange={handleCloseDrawer}>
        <SheetContent className="w-[700px] sm:max-w-[700px] overflow-y-auto px-6 pb-6">
          <SheetHeader className="mb-6">
            <SheetTitle>Order {order?.id} — {order?.customer}</SheetTitle>
          </SheetHeader>

          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="quote">Quote</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="flex gap-2 items-center">
                <Badge variant={getStatusColor(order?.status || "") as any}>
                  {order?.status}
                </Badge>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{order?.type}</span>
              </div>

              <div className="space-y-3">
                <div>
                  <Label>Customer</Label>
                  <p className="text-sm mt-1">{order?.customer}</p>
                </div>
                <div>
                  <Label>Order Type</Label>
                  <p className="text-sm mt-1">{order?.type}</p>
                </div>
                <div>
                  <Label>Created</Label>
                  <p className="text-sm mt-1">{order?.created}</p>
                </div>
                <div>
                  <Label>Last Updated</Label>
                  <p className="text-sm mt-1">{order?.created}</p>
                </div>
              </div>

              <Separator />

              {userRole !== "Employee" && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleOpenEditOrder}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast.success(`Order ${order?.id} duplicated`)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => toast.error(`Order ${order?.id} cancelled`)}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Cancel order
                  </Button>
                </div>
              )}

              <Separator />

              <div>
                <p className="text-sm mb-2">Recent Activity</p>
                <div className="space-y-2">
                  {mockTimeline.slice(0, 3).map((item, i) => (
                    <div key={i} className="text-sm">
                      <p>{item.event}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.user} • {item.date}
                      </p>
                    </div>
                  ))}
                  <Button variant="link" className="px-0">
                    View full timeline
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="quote" className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Quoted</Badge>
                <span className="text-sm text-muted-foreground">{order?.created}</span>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Custom molding unit</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>LKR 45,000</TableCell>
                      <TableCell>LKR 225,000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Installation</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>LKR 20,000</TableCell>
                      <TableCell>LKR 20,000</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm">LKR 245,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tax (0%)</span>
                  <span className="text-sm">LKR 0</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Grand Total</span>
                  <span>LKR 245,000</span>
                </div>
              </div>

              <Separator />

              {permissions.canEditQuote && (
                <>
                  <div className="flex gap-2">
                    <Button onClick={() => toast.success("Quote sent to customer")}>
                      Send Quote
                    </Button>
                    <Button variant="outline" onClick={() => toast.success("Quote saved as draft")}>
                      Save as Draft
                    </Button>
                  </div>
                  <Button variant="secondary" className="w-full" onClick={() => toast.success("Order approved for production")}>
                    Approve for Production
                  </Button>
                </>
              )}
              {!permissions.canEditQuote && (
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  <p>You don't have permission to edit quotes or approve orders for production.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="files" className="space-y-4">
              {userRole !== "Employee" && (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm">Drop files or click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF/JPG/PNG, DWG/DXF, STL
                  </p>
                </div>
              )}

              <div className="space-y-2">
                {mockFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.uploadedBy} • {file.date} • {file.size}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => toast.info(`Viewing ${file.name}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => toast.success(`Downloading ${file.name}`)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {userRole !== "Employee" && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toast.error(`Deleted ${file.name}`)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <div className="space-y-4">
                {mockTimeline.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      {i < mockTimeline.length - 1 && (
                        <div className="w-px h-full bg-border mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm">{item.event}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.user} • {item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {userRole !== "Employee" && (
                <div className="space-y-2">
                  <Label>Add note</Label>
                  <Textarea placeholder="Enter a note..." />
                  <Button size="sm">Post</Button>
                </div>
              )}
              {userRole === "Employee" && (
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  <p>You don't have permission to add notes to the timeline.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      {/* New Order Dialog */}
      <Dialog open={showNewOrder} onOpenChange={handleCloseNewOrder}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Order</DialogTitle>
            <DialogDescription>Create a new order for a customer</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                Customer <span className="text-destructive">*</span>
              </Label>
              <Select value={newOrderCustomer} onValueChange={setNewOrderCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apex">APEX Garments</SelectItem>
                  <SelectItem value="orion">Orion Tools</SelectItem>
                  <SelectItem value="ceylon">Ceylon Plastics</SelectItem>
                </SelectContent>
              </Select>
              {showNewOrderValidation && !newOrderCustomer && (
                <p className="text-xs text-destructive">Please select a customer</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Order Type <span className="text-destructive">*</span>
              </Label>
              <RadioGroup value={newOrderType} onValueChange={setNewOrderType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="factory" id="factory" />
                  <Label htmlFor="factory">Factory design</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="customer" id="customer" />
                  <Label htmlFor="customer">Customer model</Label>
                </div>
              </RadioGroup>
              {showNewOrderValidation && !newOrderType && (
                <p className="text-xs text-destructive">Please select an order type</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea 
                placeholder="Enter any notes..." 
                value={newOrderNotes}
                onChange={(e) => setNewOrderNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={handleCloseNewOrder}
              disabled={isCreatingOrder}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateOrder}
              disabled={isCreatingOrder}
            >
              {isCreatingOrder && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isCreatingOrder ? "Creating..." : "Create Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={showEditOrder} onOpenChange={(open) => !open && handleCloseEditOrder()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Order {selectedOrder}</DialogTitle>
            <DialogDescription>Update order details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                Customer <span className="text-destructive">*</span>
              </Label>
              <Input 
                placeholder="Enter customer name" 
                value={editOrderCustomer}
                onChange={(e) => setEditOrderCustomer(e.target.value)}
              />
              {showEditOrderValidation && !editOrderCustomer.trim() && (
                <p className="text-xs text-destructive">Customer name is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Order type <span className="text-destructive">*</span>
              </Label>
              <RadioGroup value={editOrderType} onValueChange={setEditOrderType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Factory design" id="edit-factory" />
                  <Label htmlFor="edit-factory">Factory design</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Customer model" id="edit-customer" />
                  <Label htmlFor="edit-customer">Customer model</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editOrderStatus} onValueChange={setEditOrderStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Quoted">Quoted</SelectItem>
                  <SelectItem value="In production">In production</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea 
                placeholder="Add any notes or updates..."
                value={editOrderNotes}
                onChange={(e) => setEditOrderNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={handleCloseEditOrder}
              disabled={isSavingOrder}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEditOrder}
              disabled={isSavingOrder}
            >
              {isSavingOrder && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isSavingOrder ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}