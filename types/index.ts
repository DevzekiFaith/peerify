export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  expertise?: string[];
  hourlyRate?: number;
  rating?: number;
  totalEarnings?: number;
  paymentDetails?: {
    phoneNumber?: string;
    upiId?: string;
    bankAccount?: string;
  };
  createdAt: string;
}

export interface Session {
  id: string;
  tutorId: string;
  studentId: string;
  subject: string;
  description: string;
  price: number;
  duration: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'completed';
  paymentMethod?: string;
  scheduledFor: string;
  createdAt: string;
}

export interface Document {
  id: string;
  userId: string;
  title: string;
  description: string;
  fileUrl: string;
  price: number;
  downloads: number;
  category: string;
  tags: string[];
  createdAt: string;
}

export interface Review {
  id: string;
  sessionId: string;
  tutorId: string;
  studentId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface PaymentDetails {
  phoneNumber?: string;
  upiId?: string;
  bankAccount?: string;
}</boltArtifact>

Now, let's create components to handle the payment process:

<boltArtifact id="payment-components" title="Create Payment Components">
<boltAction type="file" filePath="components/payments/payment-modal.tsx">
"use client"

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { User, Session } from '@/types';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
  tutor: User;
}

export function PaymentModal({ isOpen, onClose, session, tutor }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePaymentConfirmation = async () => {
    setLoading(true);
    try {
      // Update session payment status
      await updateDoc(doc(db, 'sessions', session.id), {
        paymentStatus: 'completed'
      });

      toast({
        title: "Payment Details",
        description: `Please complete the payment using the following details:\n
          ${tutor.paymentDetails?.phoneNumber ? `Phone: ${tutor.paymentDetails.phoneNumber}\n` : ''}
          ${tutor.paymentDetails?.upiId ? `UPI: ${tutor.paymentDetails.upiId}\n` : ''}
          ${tutor.paymentDetails?.bankAccount ? `Bank Account: ${tutor.paymentDetails.bankAccount}` : ''}`,
      });

      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process payment confirmation",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Payment Details</h3>
            <p className="text-sm text-muted-foreground mb-1">
              Amount: ${session.price}
            </p>
            <p className="text-sm text-muted-foreground mb-1">
              Session: {session.subject}
            </p>
            <p className="text-sm text-muted-foreground">
              Tutor: {tutor.name}
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Tutor&apos;s Payment Information</h3>
            {tutor.paymentDetails?.phoneNumber && (
              <p className="text-sm mb-1">Phone: {tutor.paymentDetails.phoneNumber}</p>
            )}
            {tutor.paymentDetails?.upiId && (
              <p className="text-sm mb-1">UPI: {tutor.paymentDetails.upiId}</p>
            )}
            {tutor.paymentDetails?.bankAccount && (
              <p className="text-sm">Bank Account: {tutor.paymentDetails.bankAccount}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handlePaymentConfirmation} disabled={loading}>
              {loading ? "Confirming..." : "Confirm Payment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}