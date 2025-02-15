"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { PaymentDetails } from '@/types';

const formSchema = z.object({
  phoneNumber: z.string().optional(),
  upiId: z.string().optional(),
  bankAccount: z.string().optional(),
});

interface PaymentDetailsFormProps {
  userId: string;
  initialData?: PaymentDetails;
  onSuccess?: () => void;
}

export function PaymentDetailsForm({ userId, initialData, onSuccess }: PaymentDetailsFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: initialData?.phoneNumber || '',
      upiId: initialData?.upiId || '',
      bankAccount: initialData?.bankAccount || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        paymentDetails: values,
      });

      toast({
        title: "Success",
        description: "Payment details updated successfully",
      });

      onSuccess?.();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update payment details",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="upiId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UPI ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter your UPI ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bankAccount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Account Details</FormLabel>
              <FormControl>
                <Input placeholder="Enter your bank account details" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Save Payment Details
        </Button>
      </form>
    </Form>
  );
}