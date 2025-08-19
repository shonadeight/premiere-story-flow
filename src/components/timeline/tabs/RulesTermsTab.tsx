import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, FileText, Calendar, Users, DollarSign, Eye, Lock, Edit3 } from "lucide-react";

export const RulesTermsTab = () => {
  const rules = [
    {
      id: "visibility",
      title: "Visibility Rules",
      description: "Controls who can view and access this timeline",
      icon: Eye,
      status: "active",
      details: [
        "Public viewing allowed",
        "Private contribution data",
        "Member-only analytics access",
        "Admin dashboard restricted"
      ]
    },
    {
      id: "access",
      title: "Access Control",
      description: "Defines member permissions and roles",
      icon: Lock,
      status: "active",
      details: [
        "Owner: Full control",
        "Admins: Edit and approve (5 users)",
        "Contributors: View and contribute",
        "Viewers: Read-only access"
      ]
    },
    {
      id: "deadlines",
      title: "Timeline Deadlines",
      description: "Important dates and milestones",
      icon: Calendar,
      status: "warning",
      details: [
        "Contribution deadline: Dec 31, 2024",
        "Milestone 1: Jan 15, 2025",
        "Final completion: Jun 30, 2025",
        "Payout schedule: Quarterly"
      ]
    },
    {
      id: "terms",
      title: "Terms & Conditions",
      description: "Legal agreements and conditions",
      icon: FileText,
      status: "active",
      details: [
        "Revenue sharing: 15% to contributors",
        "Intellectual property shared",
        "Non-disclosure agreement required",
        "Dispute resolution via arbitration"
      ]
    },
    {
      id: "capital",
      title: "Capital Share Flow",
      description: "How capital and returns are distributed",
      icon: DollarSign,
      status: "active",
      details: [
        "Financial contributions: 60% weight",
        "Time contributions: 25% weight",
        "Network contributions: 10% weight",
        "IP contributions: 5% weight"
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "warning": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "inactive": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Rules & Terms</h3>
        </div>
        <Button variant="outline" size="sm" className="touch-manipulation">
          <Edit3 className="h-4 w-4 mr-2" />
          Edit Rules
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {rules.map((rule, index) => {
          const Icon = rule.icon;
          return (
            <Card key={rule.id} className="h-fit">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">{rule.title}</CardTitle>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(rule.status)}`}
                  >
                    {rule.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{rule.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {rule.details.map((detail, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{detail}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { version: "v2.1", date: "2024-01-15", changes: "Updated capital flow distribution", author: "Admin" },
              { version: "v2.0", date: "2023-12-10", changes: "Major terms revision", author: "Legal Team" },
              { version: "v1.5", date: "2023-11-20", changes: "Added IP sharing clause", author: "Admin" },
              { version: "v1.0", date: "2023-10-01", changes: "Initial terms creation", author: "Owner" }
            ].map((version, i) => (
              <div key={i}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{version.version}</div>
                    <div className="text-xs text-muted-foreground">{version.changes}</div>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    <div>{version.date}</div>
                    <div>by {version.author}</div>
                  </div>
                </div>
                {i < 3 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};