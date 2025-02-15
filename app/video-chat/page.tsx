"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function VideoChat() {
  const [sessionId, setSessionId] = useState('');
  const router = useRouter();

  const joinSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionId) {
      router.push(`/video-chat/${sessionId}`);
    }
  };

  return (
    <div className="container py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Join Video Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={joinSession} className="space-y-4">
            <Input
              placeholder="Enter session ID"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Join Session
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 