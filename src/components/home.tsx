import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardMetrics from "./dashboard/DashboardMetrics";
import UpcomingItems from "./dashboard/UpcomingItems";
import { Button } from "@/components/ui/button";

const Home: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-6 bg-white min-h-screen">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's an overview of your organization.
        </p>
      </div>

      {/* Dashboard Metrics */}
      <DashboardMetrics />

      {/* Upcoming Items */}
      <UpcomingItems />

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" asChild>
              <Link to="/clients">Add New Client</Link>
            </Button>
            <Button className="w-full" asChild>
              <Link to="/prospects">Add New Prospect</Link>
            </Button>
            <Button className="w-full" asChild>
              <Link to="/tasks">Create Task</Link>
            </Button>
            <Button className="w-full" asChild>
              <Link to="/invoices/new">Create Invoice</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Organization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="font-medium">{user?.organizationName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Members</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Plan</span>
                <span className="font-medium">Professional</span>
              </div>
              {user?.role === "admin" && (
                <Button variant="outline" className="w-full mt-2" asChild>
                  <Link to="/settings">Manage Organization</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "Invoice created",
                  target: "INV-2023-001",
                  user: "Jane Smith",
                  time: "2 hours ago",
                },
                {
                  action: "Client added",
                  target: "Acme Corp",
                  user: "John Doe",
                  time: "5 hours ago",
                },
                {
                  action: "Task completed",
                  target: "Website redesign",
                  user: "Sarah Johnson",
                  time: "1 day ago",
                },
                {
                  action: "Prospect converted",
                  target: "Tech Solutions Inc",
                  user: "Mike Wilson",
                  time: "2 days ago",
                },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {activity.action}: {activity.target}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      By {activity.user}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
