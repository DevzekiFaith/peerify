import { Document } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

interface DocumentCardProps {
  document: Document;
  onDownload: (doc: Document) => void;
}

export function DocumentCard({ document, onDownload }: DocumentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>{document.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{document.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {document.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">${document.price}</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDownload(document)}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}