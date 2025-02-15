"use client"

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/components/auth/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, DollarSign, Star } from 'lucide-react';
import { Session, Review } from '@/types';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function TutorDashboard() {
  const { user } = useAuthContext();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchTutorData = async () => {
      // Fetch sessions
      const sessionsQuery = query(
        collection(db, 'sessions'),
        where('tutorId', '==', user.uid)
      );
      const sessionsSnapshot = await getDocs(sessionsQuery);
      const sessionsData = sessionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Session[];
      setSessions(sessionsData);

      // Fetch reviews
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('tutorId', '==', user.uid)
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviewsData = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(reviewsData);

      // Calculate earnings
      const totalEarnings = sessionsData
        .filter(session => session.status === 'completed')
        .reduce((sum, session) => sum + session.price, 0);
      setEarnings(totalEarnings);
    };

    fetchTutorData();
  }, [user]);

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Tutor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(sessions.map(s => s.studentId)).size}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earnings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
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
                  <Button variant="outline">Join Session</Button>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.slice(0, 5).map(review => (
              <div
                key={review.id}
                className="border-b py-4 last:border-0"
              >
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="font-semibold">{review.rating}/5</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}