import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserCog, Shield } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface AdminUsersAdderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (admin: any) => void;
}

export const AdminUsersAdder = ({ open, onOpenChange, onSave }: AdminUsersAdderProps) => {
  const isMobile = useIsMobile();
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('moderator');
  const [canApprove, setCanApprove] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const handleSave = () => {
    const admin = {
      user_id: userId,
      role,
      permissions: {
        can_approve: canApprove,
        can_edit: canEdit,
        can_delete: canDelete,
        is_admin: true
      }
    };
    onSave(admin);
    setUserId('');
    setRole('moderator');
    setCanApprove(true);
    setCanEdit(false);
    setCanDelete(false);
    onOpenChange(false);
  };

  const content = (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label>User ID or Email</Label>
        <Input
          placeholder="Enter user ID or email"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Admin Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="moderator">Moderator</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 pt-2">
        <Label className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Permissions
        </Label>
        
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <Label htmlFor="can-approve" className="text-sm">Can Approve Contributions</Label>
          <Switch
            id="can-approve"
            checked={canApprove}
            onCheckedChange={setCanApprove}
          />
        </div>

        <div className="flex items-center justify-between p-3 border rounded-lg">
          <Label htmlFor="can-edit" className="text-sm">Can Edit Timelines</Label>
          <Switch
            id="can-edit"
            checked={canEdit}
            onCheckedChange={setCanEdit}
          />
        </div>

        <div className="flex items-center justify-between p-3 border rounded-lg">
          <Label htmlFor="can-delete" className="text-sm">Can Delete Content</Label>
          <Switch
            id="can-delete"
            checked={canDelete}
            onCheckedChange={setCanDelete}
          />
        </div>
      </div>

      <Button onClick={handleSave} className="w-full" disabled={!userId}>
        <UserCog className="mr-2 h-4 w-4" />
        Add Admin User
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add Admin User</DrawerTitle>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Admin User</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
