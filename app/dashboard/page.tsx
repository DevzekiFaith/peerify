"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Video, FileText } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return null
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Video className="h-8 w-8" />
            <div>
              <h2 className="text-xl font-semibold">Video Chat</h2>
              <p className="text-sm text-muted-foreground">Start or join a video call</p>
            </div>
          </div>
          <Button asChild>
            <Link href="/video-chat">Start Video Chat</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <FileText className="h-8 w-8" />
            <div>
              <h2 className="text-xl font-semibold">Documents</h2>
              <p className="text-sm text-muted-foreground">Manage your shared documents</p>
            </div>
          </div>
          <Button asChild>
            <Link href="/documents">View Documents</Link>
          </Button>
        </Card>
      </div>
    </div>
  )
}