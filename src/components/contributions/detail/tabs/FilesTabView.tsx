import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { File, Download, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface FilesTabViewProps {
  contributionId: string;
}

interface FileData {
  id: string;
  file_name: string;
  file_type: string | null;
  file_url: string;
  file_size: number | null;
  subtype_name: string | null;
  created_at: string;
}

export const FilesTabView = ({ contributionId }: FilesTabViewProps) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, [contributionId]);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('contribution_files')
        .select('*')
        .eq('contribution_id', contributionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <File className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No files attached yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <Card key={file.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <File className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base truncate">{file.file_name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    {file.file_type && (
                      <Badge variant="secondary" className="text-xs">
                        {file.file_type}
                      </Badge>
                    )}
                    {file.subtype_name && (
                      <Badge variant="outline" className="text-xs capitalize">
                        {file.subtype_name.replace(/_/g, ' ')}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(file.file_url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatFileSize(file.file_size)}</span>
              <span>{format(new Date(file.created_at), 'MMM d, yyyy')}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
