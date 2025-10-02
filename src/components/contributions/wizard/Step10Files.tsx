import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FilesAdder } from '../adders/FilesAdder';
import { Plus, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Step10FilesProps {
  contributionId: string;
}

export const Step10Files = ({ contributionId }: Step10FilesProps) => {
  const [adderOpen, setAdderOpen] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSaveFile = async (file: any) => {
    try {
      const { error } = await supabase
        .from('contribution_files')
        .insert({
          contribution_id: contributionId,
          file_name: file.file_name,
          file_type: file.file_type,
          file_url: file.file_url,
          file_size: file.file_size,
        });

      if (error) throw error;

      setFiles([...files, file]);
      toast({
        title: "Success",
        description: "File requirement added successfully",
      });
    } catch (error) {
      console.error('Error saving file:', error);
      toast({
        title: "Error",
        description: "Failed to save file requirement",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          Specify required files and documents for this contribution.
        </AlertDescription>
      </Alert>

      <Button onClick={() => setAdderOpen(true)} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add File Requirement
      </Button>

      {files.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No file requirements yet
        </p>
      )}

      {files.map((file, i) => (
        <Card key={i} className="p-3">
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{file.file_name}</p>
              <p className="text-sm text-muted-foreground">{file.file_type}</p>
            </div>
          </div>
        </Card>
      ))}

      <FilesAdder
        open={adderOpen}
        onOpenChange={setAdderOpen}
        onSave={handleSaveFile}
      />
    </div>
  );
};
