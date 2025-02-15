"use client"

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/components/auth/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Clock, DollarSign } from 'lucide-react';
import { Session } from '@/types';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';

export default function StudentDashboard() {
  const { user } = useAuthContext();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchStudentData = async () => {
      const sessionsQuery = query(
        collection(db, 'sessions'),
        where('studentId', '==', user.uid)
      );
      const sessionsSnapshot = await getDocs(sessionsQuery);
      const sessionsData = sessionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Session[];
      setSessions(sessionsData);

      const total = sessionsData
        .filter(session => session.status === 'completed')
        .reduce((sum, session) => sum + session.price, 0);
      setTotalSpent(total);
    };

    fetchStudentData();
  }, [user]);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.filter(s => s.status === 'scheduled').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {sessions
              .filter(session => session.status === 'scheduled')
              .map(session => (
                <div
                  key={session.id}
                  className="flex items-center justify-between border-b py-4 last:border-0"
                >
                  <div>
                    <h3 className="font-semibold">{session.subject}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.scheduledFor).toLocaleString()}
                    </p>
                  </div>
                  <Button asChild>
                    <Link href={`/video-chat/${session.id}`}>
                      Join Session
                    </Link>
                  </Button>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Find Tutors</CardTitle>
              <Button asChild>
                <Link href="/tutors">Browse All Tutors</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-24" asChild>
                <Link href="/tutors?subject=mathematics">
                  <div className="text-center">
                    <h3 className="font-semibold">Mathematics</h3>
                    <p className="text-sm text-muted-foreground">Find math tutors</p>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="h-24" asChild>
                <Link href="/tutors?subject=programming">
                  <div className="text-center">
                    <h3 className="font-semibold">Programming</h3>
                    <p className="text-sm text-muted-foreground">Learn to code</p>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}