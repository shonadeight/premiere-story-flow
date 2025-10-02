import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AdminUsersAdder } from '../adders/AdminUsersAdder';
import { Plus, UserCog, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Step13AdminUsersProps {
  contributionId: string;
}

export const Step13AdminUsers = ({ contributionId }: Step13AdminUsersProps) => {
  const [adderOpen, setAdderOpen] = useState(false);
  const [admins, setAdmins] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSaveAdmin = async (admin: any) => {
    try {
      const { error } = await supabase
        .from('contribution_contributors')
        .insert({
          contribution_id: contributionId,
          user_id: admin.user_id,
          role: admin.role,
          permissions: admin.permissions,
        });

      if (error) throw error;

      setAdmins([...admins, admin]);
      toast({
        title: "Success",
        description: "Admin user added successfully",
      });
    } catch (error) {
      console.error('Error saving admin:', error);
      toast({
        title: "Error",
        description: "Failed to save admin user",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <Alert>
        <UserCog className="h-4 w-4" />
        <AlertDescription>
          Add admin users who can manage this contribution with specific permissions.
        </AlertDescription>
      </Alert>

      <Button onClick={() => setAdderOpen(true)} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Admin User
      </Button>

      {admins.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No admin users added yet
        </p>
      )}

      {admins.map((admin, i) => (
        <Card key={i} className="p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{admin.user_id}</p>
              </div>
              <Badge variant="secondary">{admin.role}</Badge>
            </div>
            <div className="flex flex-wrap gap-1">
              {admin.permissions.can_approve && (
                <Badge variant="outline" className="text-xs">Can Approve</Badge>
              )}
              {admin.permissions.can_edit && (
                <Badge variant="outline" className="text-xs">Can Edit</Badge>
              )}
              {admin.permissions.can_delete && (
                <Badge variant="outline" className="text-xs">Can Delete</Badge>
              )}
            </div>
          </div>
        </Card>
      ))}

      <AdminUsersAdder
        open={adderOpen}
        onOpenChange={setAdderOpen}
        onSave={handleSaveAdmin}
      />
    </div>
  );
};
