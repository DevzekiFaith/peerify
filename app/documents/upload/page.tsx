"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthContext } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '../../../hooks/use-toast';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().min(1, 'Price is required').transform(Number),
  category: z.string().min(1, 'Category is required'),
  tags: z.string(),
});

export default function UploadDocument() {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { user } = useAuthContext();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      category: '',
      tags: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;

    const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
    const file = fileInput?.files?.[0];

    if (!file) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a file to upload",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload file to Firebase Storage
      const storageRef = ref(storage, `documents/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Save document metadata to Firestore
      await addDoc(collection(db, 'documents'), {
        userId: user.uid,
        title: values.title,
        description: values.description,
        fileUrl: downloadURL,
        price: values.price,
        category: values.category,
        tags: values.tags.split(',').map(tag => tag.trim()),
        downloads: 0,
        createdAt: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      // Reset the form fields
      form.reset();

      router.push('/documents');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload document",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Upload Document</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter document title" className="mt-1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter document description"
                        className="mt-1"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter price"
                        className="mt-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category" className="mt-1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">Tags (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tags" className="mt-1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel className="text-lg font-medium">File</FormLabel>
                <Input type="file" accept=".pdf,.doc,.docx" className="mt-1" />
              </div>

              <Button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled={uploading}>
                {uploading ? "Uploading..." : "Upload Document"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}