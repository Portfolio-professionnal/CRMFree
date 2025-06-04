import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  Users,
  UserPlus,
  CheckSquare,
  FileText,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  change?: number;
  changeLabel?: string;
}

const MetricCard = ({
  title,
  value,
  icon,
  change = 0,
  changeLabel = "from last month",
}: MetricCardProps) => {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {change !== undefined && (
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {isPositive ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={isPositive ? "text-green-500" : "text-red-500"}>
                {Math.abs(change)}%
              </span>
              <span className="ml-1">{changeLabel}</span>
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface DashboardMetricsProps {
  clientCount?: number;
  prospectCount?: number;
  taskCount?: number;
  invoiceCount?: number;
  revenueData?: number[];
  revenueLabels?: string[];
}

const DashboardMetrics = ({
  clientCount = 24,
  prospectCount = 12,
  taskCount = 7,
  invoiceCount = 5,
  revenueData = [4800, 5200, 4900, 6500, 7200, 8100],
  revenueLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
}: DashboardMetricsProps) => {
  // Mock chart data
  const chartData = {
    labels: revenueLabels,
    datasets: [
      {
        label: "Monthly Revenue",
        data: revenueData,
        backgroundColor: "rgba(99, 102, 241, 0.5)",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: (value: any) => `$${value}`,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Revenue: $${context.raw}`,
        },
      },
    },
  };

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Dashboard Metrics</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Clients"
          value={clientCount}
          icon={<Users className="h-4 w-4" />}
          change={8}
        />
        <MetricCard
          title="Active Prospects"
          value={prospectCount}
          icon={<UserPlus className="h-4 w-4" />}
          change={12}
        />
        <MetricCard
          title="Active Tasks"
          value={taskCount}
          icon={<CheckSquare className="h-4 w-4" />}
          change={-3}
        />
        <MetricCard
          title="Unpaid Invoices"
          value={invoiceCount}
          icon={<FileText className="h-4 w-4" />}
          change={2}
        />
      </div>

      <div className="mt-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Revenue (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {/* Chart placeholder - in a real app, you'd use a chart library */}
              <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">
                  Revenue chart would render here with Chart.js
                </p>
                {/* Uncomment when Chart.js is properly set up */}
                {/* <Bar data={chartData} options={chartOptions} /> */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardMetrics;
