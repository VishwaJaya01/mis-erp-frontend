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
import { Search, Download, Plus, MoreVertical, Upload, FileText, Trash2, Eye, Edit, Copy, Ban } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleRowClick = (orderId: string) => {
    setSelectedOrder(orderId);
  };

  const handleCloseDrawer = () => {
    setSelectedOrder(null);
  };

  const order = mockOrders.find(o => o.id === selectedOrder);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Quoted": return "secondary";
      case "In production": return "default";
      case "Completed": return "outline";
      case "Draft": return "outline";
      default: return "secondary";
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
              <Button variant="ghost">
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
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search order # or customer"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select>
                <SelectTrigger className="w-48">
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
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="customer">Customer model</SelectItem>
                  <SelectItem value="factory">Factory design</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox />
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
              {mockOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer"
                  onClick={() => handleRowClick(order.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox />
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
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Ban className="h-4 w-4 mr-2" />
                          Cancel order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Order Drawer */}
      <Sheet open={!!selectedOrder} onOpenChange={handleCloseDrawer}>
        <SheetContent className="w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Order {order?.id} — {order?.customer}</SheetTitle>
          </SheetHeader>

          <Tabs defaultValue="details" className="mt-6">
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

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit details
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
                <Button variant="destructive" size="sm">
                  <Ban className="h-4 w-4 mr-2" />
                  Cancel order
                </Button>
              </div>

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
            </TabsContent>

            <TabsContent value="files" className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm">Drop files or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF/JPG/PNG, DWG/DXF, STL
                </p>
              </div>

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
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

              <div className="space-y-2">
                <Label>Add note</Label>
                <Textarea placeholder="Enter a note..." />
                <Button size="sm">Post</Button>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      {/* New Order Dialog */}
      <Dialog open={showNewOrder} onOpenChange={setShowNewOrder}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Order</DialogTitle>
            <DialogDescription>Create a new order for a customer</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Customer</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apex">APEX Garments</SelectItem>
                  <SelectItem value="orion">Orion Tools</SelectItem>
                  <SelectItem value="ceylon">Ceylon Plastics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Order Type</Label>
              <RadioGroup defaultValue="factory">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="factory" id="factory" />
                  <Label htmlFor="factory">Factory design</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="customer" id="customer" />
                  <Label htmlFor="customer">Customer model</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Enter any notes..." />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewOrder(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowNewOrder(false);
              toast.success("Order created successfully");
            }}>
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}