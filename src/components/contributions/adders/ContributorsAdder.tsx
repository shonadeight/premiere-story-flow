import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserPlus } from 'lucide-react';

interface ContributorsAdderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (contributor: any) => void;
}

export const ContributorsAdder = ({ open, onOpenChange, onSave }: ContributorsAdderProps) => {
  const isMobile = useIsMobile();
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('contributor');

  const handleSave = () => {
    const contributor = {
      user_id: userId,
      role,
      permissions: { view: true, edit: role === 'admin' }
    };
    onSave(contributor);
    setUserId('');
    setRole('contributor');
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
        <Label>Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="viewer">Viewer</SelectItem>
            <SelectItem value="contributor">Contributor</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleSave} className="w-full">
        <UserPlus className="mr-2 h-4 w-4" />
        Add Contributor
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add Contributor</DrawerTitle>
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
          <DialogTitle>Add Contributor</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
