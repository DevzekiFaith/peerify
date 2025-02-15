"use client"

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Document } from '@/types';
import { fetchDocuments } from '@/lib/utils/firebase';
import { Search, Plus } from 'lucide-react';
import { DocumentGrid } from '@/components/documents/document-grid';
import { useToast } from '../../hooks/use-toast';
import Link from 'next/link';

export default function Documents() {
  const { user } = useAuthContext();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const loadDocuments = async () => {
      const docs = await fetchDocuments({ searchTerm });
      setDocuments(docs as Document[]);
    };

    loadDocuments();
  }, [searchTerm]);

  const handleDownload = async (doc: Document) => {
    // Implement download logic here
    toast({
      title: "Download started",
      description: `Downloading ${doc.title}...`,
    });
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Documents</h1>
        <Button asChild>
          <Link href="/documents/upload">
            <Plus className="mr-2 h-4 w-4" />
            Upload Document
          </Link>
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <DocumentGrid 
        documents={documents}
        onDownload={handleDownload}
      />
    </div>
  );
}