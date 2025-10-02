import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { FileUp, File } from 'lucide-react';

interface FilesAdderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (file: any) => void;
}

export const FilesAdder = ({ open, onOpenChange, onSave }: FilesAdderProps) => {
  const isMobile = useIsMobile();
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');

  const handleSave = () => {
    const file = {
      file_name: fileName,
      file_type: fileType,
      file_url: `placeholder-${Date.now()}`, // In production, upload to storage
      file_size: 0
    };
    onSave(file);
    setFileName('');
    setFileType('');
    onOpenChange(false);
  };

  const content = (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label>File Name</Label>
        <Input
          placeholder="e.g., Title Deed, Contract, Certificate"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>File Type</Label>
        <Input
          placeholder="e.g., PDF, Image, Document"
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
        />
      </div>

      <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
        <FileUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
        <p className="text-xs text-muted-foreground mt-1">PDF, DOC, JPG, PNG up to 10MB</p>
      </div>

      <Button onClick={handleSave} className="w-full">
        <File className="mr-2 h-4 w-4" />
        Add File Requirement
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add File Requirement</DrawerTitle>
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
          <DialogTitle>Add File Requirement</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
