import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Copy,
  Trash2,
  Users,
  Settings as SettingsIcon,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  joinedAt: string;
  lastActive: string;
}

interface InviteCode {
  id: string;
  code: string;
  role: "admin" | "user";
  status: "active" | "used" | "expired";
  createdAt: string;
  expiresAt: string;
  usedBy?: string;
}

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [inviteRole, setInviteRole] = useState<"admin" | "user">("user");

  // Organization settings state
  const [orgName, setOrgName] = useState(user?.organizationName || "");
  const [orgDescription, setOrgDescription] = useState(
    "A modern CRM solution for growing businesses",
  );

  // Mock team members data
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@acme.com",
      role: "admin",
      status: "active",
      joinedAt: "2023-01-15",
      lastActive: "2023-06-14",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@acme.com",
      role: "user",
      status: "active",
      joinedAt: "2023-02-20",
      lastActive: "2023-06-13",
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike@acme.com",
      role: "user",
      status: "inactive",
      joinedAt: "2023-03-10",
      lastActive: "2023-05-28",
    },
  ]);

  // Mock invite codes data
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([
    {
      id: "1",
      code: "ACME-USER-2023-001",
      role: "user",
      status: "active",
      createdAt: "2023-06-10",
      expiresAt: "2023-07-10",
    },
    {
      id: "2",
      code: "ACME-ADMIN-2023-001",
      role: "admin",
      status: "used",
      createdAt: "2023-05-15",
      expiresAt: "2023-06-15",
      usedBy: "jane@acme.com",
    },
    {
      id: "3",
      code: "ACME-USER-2023-002",
      role: "user",
      status: "expired",
      createdAt: "2023-04-20",
      expiresAt: "2023-05-20",
    },
  ]);

  // Only allow admin users to access settings
  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white">
        <div className="text-center">
          <SettingsIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            Access Denied
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You need admin privileges to access organization settings.
          </p>
        </div>
      </div>
    );
  }

  const handleSaveOrganization = () => {
    toast({
      title: "Organization Updated",
      description: "Organization settings have been saved successfully.",
    });
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id));
    toast({
      title: "Member Removed",
      description: "Team member has been removed from the organization.",
    });
  };

  const handleChangeRole = (id: string, newRole: "admin" | "user") => {
    setTeamMembers(
      teamMembers.map((member) =>
        member.id === id ? { ...member, role: newRole } : member,
      ),
    );
    toast({
      title: "Role Updated",
      description: "Team member role has been updated successfully.",
    });
  };

  const generateInviteCode = () => {
    const newCode: InviteCode = {
      id: Date.now().toString(),
      code: `ACME-${inviteRole.toUpperCase()}-${new Date().getFullYear()}-${String(inviteCodes.length + 1).padStart(3, "0")}`,
      role: inviteRole,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };

    setInviteCodes([...inviteCodes, newCode]);
    setIsInviteDialogOpen(false);
    toast({
      title: "Invite Code Generated",
      description: `New ${inviteRole} invite code has been created.`,
    });
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied",
      description: "Invite code has been copied to clipboard.",
    });
  };

  const deleteInviteCode = (id: string) => {
    setInviteCodes(inviteCodes.filter((invite) => invite.id !== id));
    toast({
      title: "Invite Code Deleted",
      description: "Invite code has been deleted successfully.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
      case "expired":
        return "bg-red-100 text-red-800";
      case "used":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 bg-white min-h-screen p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Organization Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your organization settings and team members
        </p>
      </div>

      <Tabs defaultValue="organization" className="space-y-4">
        <TabsList>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="team">Team Management</TabsTrigger>
          <TabsTrigger value="invites">Invite Codes</TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>
                Update your organization information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgDescription">Description</Label>
                  <Input
                    id="orgDescription"
                    value={orgDescription}
                    onChange={(e) => setOrgDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveOrganization}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage your organization's team members and their roles
                  </CardDescription>
                </div>
                <Button onClick={() => setIsTeamDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.name}
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Select
                          value={member.role}
                          onValueChange={(value) =>
                            handleChangeRole(
                              member.id,
                              value as "admin" | "user",
                            )
                          }
                          disabled={member.id === user?.id}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(member.lastActive).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {member.id !== user?.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invites" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Invite Codes</CardTitle>
                  <CardDescription>
                    Generate invite codes for new team members
                  </CardDescription>
                </div>
                <Button onClick={() => setIsInviteDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Code
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inviteCodes.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell className="font-mono text-sm">
                        {invite.code}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            invite.role === "admin" ? "default" : "secondary"
                          }
                        >
                          {invite.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invite.status)}>
                          {invite.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(invite.expiresAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {invite.status === "active" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyInviteCode(invite.code)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteInviteCode(invite.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Generate Invite Code</DialogTitle>
            <DialogDescription>
              Create a new invite code for team members to join your
              organization
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={inviteRole}
                onValueChange={(value) =>
                  setInviteRole(value as "admin" | "user")
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={generateInviteCode}>
              Generate Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
