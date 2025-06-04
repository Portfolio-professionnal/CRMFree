import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  DollarSign,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
}

interface UpcomingItemsProps {
  tasks?: Task[];
  invoices?: Invoice[];
}

const UpcomingItems = ({ tasks = [], invoices = [] }: UpcomingItemsProps) => {
  // Default tasks if none provided
  const defaultTasks: Task[] = [
    {
      id: "1",
      title: "Complete client website redesign",
      dueDate: "2023-06-15",
      priority: "high",
      status: "in-progress",
    },
    {
      id: "2",
      title: "Review marketing strategy",
      dueDate: "2023-06-18",
      priority: "medium",
      status: "pending",
    },
    {
      id: "3",
      title: "Prepare quarterly report",
      dueDate: "2023-06-20",
      priority: "high",
      status: "pending",
    },
    {
      id: "4",
      title: "Client meeting preparation",
      dueDate: "2023-06-14",
      priority: "medium",
      status: "in-progress",
    },
    {
      id: "5",
      title: "Update portfolio",
      dueDate: "2023-06-25",
      priority: "low",
      status: "pending",
    },
  ];

  // Default invoices if none provided
  const defaultInvoices: Invoice[] = [
    {
      id: "1",
      invoiceNumber: "INV-2023-001",
      clientName: "Acme Corp",
      amount: 1500.0,
      dueDate: "2023-06-20",
      status: "pending",
    },
    {
      id: "2",
      invoiceNumber: "INV-2023-002",
      clientName: "TechStart Inc",
      amount: 2750.0,
      dueDate: "2023-06-15",
      status: "pending",
    },
    {
      id: "3",
      invoiceNumber: "INV-2023-003",
      clientName: "Global Solutions",
      amount: 950.0,
      dueDate: "2023-06-10",
      status: "overdue",
    },
    {
      id: "4",
      invoiceNumber: "INV-2023-004",
      clientName: "Creative Design Co",
      amount: 3200.0,
      dueDate: "2023-06-25",
      status: "pending",
    },
    {
      id: "5",
      invoiceNumber: "INV-2023-005",
      clientName: "Marketing Experts",
      amount: 1800.0,
      dueDate: "2023-06-30",
      status: "pending",
    },
  ];

  const displayTasks = tasks.length > 0 ? tasks : defaultTasks;
  const displayInvoices = invoices.length > 0 ? invoices : defaultInvoices;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "paid":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
      {/* Recent Tasks */}
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-primary" />
            Recent Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button size="sm">Complete</Button>
                </div>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-center">
            <Button variant="outline" className="w-full">
              View All Tasks
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Invoices */}
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            Upcoming Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{invoice.invoiceNumber}</h3>
                    <p className="text-sm text-gray-600">
                      {invoice.clientName}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Due {formatDate(invoice.dueDate)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-semibold text-green-700">
                      {formatCurrency(invoice.amount)}
                    </span>
                    <Badge
                      className={getStatusColor(invoice.status)}
                      variant="outline"
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button size="sm">
                    <DollarSign className="h-4 w-4 mr-1" /> Mark Paid
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-center">
            <Button variant="outline" className="w-full">
              View All Invoices
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpcomingItems;
