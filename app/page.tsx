import { Button } from "@/components/ui/button"
import { Video, FileText } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Connect, Share, and Learn Together
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          A peer-to-peer platform for seamless video chat and document sharing with your friends and fellow students.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
        <Link href="/video-chat" className="group">
          <div className="relative overflow-hidden rounded-lg border bg-background p-6 hover:border-primary transition-colors">
            <div className="flex items-center justify-between">
              <Video className="h-12 w-12 transition-transform group-hover:scale-110" />
              <Button variant="ghost">Get Started →</Button>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">Video Chat</h3>
              <p className="text-sm text-muted-foreground">
                Start a video call with your peers instantly. No downloads required.
              </p>
            </div>
          </div>
        </Link>

        <Link href="/documents" className="group">
          <div className="relative overflow-hidden rounded-lg border bg-background p-6 hover:border-primary transition-colors">
            <div className="flex items-center justify-between">
              <FileText className="h-12 w-12 transition-transform group-hover:scale-110" />
              <Button variant="ghost">Browse Files →</Button>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">Document Sharing</h3>
              <p className="text-sm text-muted-foreground">
                Share and collaborate on documents securely with your study group.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}