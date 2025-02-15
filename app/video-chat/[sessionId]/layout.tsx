export function generateStaticParams() {
  // Provide an array of possible session IDs that might be accessed
  return [
    { sessionId: 'demo-session' },
    { sessionId: '12345678' },
    { sessionId: 'test-session' },
    // Add more static paths as needed
    { sessionId: 'session-1' },
    { sessionId: 'session-2' },
    { sessionId: 'session-3' }
  ];
}

export default function VideoChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 