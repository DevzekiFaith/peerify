import { Document } from '@/types';
import { DocumentCard } from './document-card';

interface DocumentGridProps {
  documents: Document[];
  onDownload: (doc: Document) => void;
}

export function DocumentGrid({ documents, onDownload }: DocumentGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
}