import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserCheck, Crown, Shield, Settings, Plus, MoreHorizontal, Clock, CheckCircle, XCircle } from "lucide-react";

export const AdminTab = () => {
  const admins = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@email.com",
      role: "Owner",
      avatar: "/placeholder.svg",
      permissions: ["Full Access", "Edit Rules", "Manage Members", "Financial Control"],
      joinedDate: "2023-10-01",
      lastActive: "2 hours ago",
      status: "active"
    },
    {
      id: "2", 
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      role: "Admin",
      avatar: "/placeholder.svg",
      permissions: ["Edit Timeline", "Approve Contributions", "Manage Files"],
      joinedDate: "2023-11-15",
      lastActive: "1 day ago",
      status: "active"
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike.chen@email.com", 
      role: "Moderator",
      avatar: "/placeholder.svg",
      permissions: ["Review Content", "Moderate Discussions"],
      joinedDate: "2023-12-01",
      lastActive: "3 days ago",
      status: "inactive"
    }
  ];

  const pendingRequests = [
    {
      id: "1",
      name: "Alice Brown",
      email: "alice.b@email.com",
      requestedRole: "Admin",
      requestDate: "2024-01-10",
      reason: "Contributed significant funding and wants administrative access"
    },
    {
      id: "2",
      name: "David Wilson", 
      email: "d.wilson@email.com",
      requestedRole: "Moderator",
      requestDate: "2024-01-08",
      reason: "Active community member, wants to help moderate discussions"
    }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Owner": return Crown;
      case "Admin": return Shield;
      case "Moderator": return UserCheck;
      default: return UserCheck;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Owner": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Admin": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Moderator": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Timeline Administration</h3>
        </div>
        <Button size="sm" className="touch-manipulation">
          <Plus className="h-4 w-4 mr-2" />
          Add Admin
        </Button>
      </div>

      {/* Current Administrators */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Current Administrators ({admins.length})</span>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Manage Permissions
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {admins.map((admin, index) => {
              const RoleIcon = getRoleIcon(admin.role);
              return (
                <div key={admin.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={admin.avatar} alt={admin.name} />
                        <AvatarFallback>{admin.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{admin.name}</h4>
                          <Badge variant="outline" className={`text-xs ${getRoleColor(admin.role)}`}>
                            <RoleIcon className="h-3 w-3 mr-1" />
                            {admin.role}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${getStatusColor(admin.status)}`}>
                            {admin.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{admin.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Joined: {admin.joinedDate}</span>
                          <span>Last active: {admin.lastActive}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {admin.permissions.map((permission) => (
                            <Badge key={permission} variant="secondary" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  {index < admins.length - 1 && <Separator className="mt-4" />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending Admin Requests ({pendingRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingRequests.map((request, index) => (
              <div key={request.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{request.name}</h4>
                      <Badge variant="outline" className={`text-xs ${getRoleColor(request.requestedRole)}`}>
                        {request.requestedRole}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{request.email}</p>
                    <p className="text-sm text-muted-foreground">{request.reason}</p>
                    <p className="text-xs text-muted-foreground mt-1">Requested: {request.requestDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <XCircle className="h-4 w-4 mr-1" />
                      Deny
                    </Button>
                  </div>
                </div>
                {index < pendingRequests.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permission Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Permission Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                role: "Owner",
                permissions: ["All Permissions", "Delete Timeline", "Transfer Ownership"],
                description: "Complete control over timeline"
              },
              {
                role: "Admin", 
                permissions: ["Edit Timeline", "Manage Members", "Approve Funds", "View Analytics"],
                description: "High-level management access"
              },
              {
                role: "Moderator",
                permissions: ["Review Content", "Moderate Chat", "Basic Analytics"],
                description: "Content and community management"
              }
            ].map((template) => (
              <Card key={template.role} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={`${getRoleColor(template.role)}`}>
                    {template.role}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                <div className="space-y-1">
                  {template.permissions.map((permission) => (
                    <div key={permission} className="text-xs text-muted-foreground">
                      • {permission}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};