"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Video, FileText, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuthContext } from "@/components/auth/auth-provider"
import { signOut } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function Header() {
  const { setTheme, theme } = useTheme()
  const { user } = useAuthContext()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Video className="h-6 w-6" />
            <span className="font-bold">Edupeer</span>
          </Link>
          {user && (
            <nav className="flex items-center space-x-4">
              <Link href="/video-chat" className="text-sm font-medium hover:text-primary">
                Video Chat
              </Link>
              <Link href="/documents" className="text-sm font-medium hover:text-primary">
                Documents
              </Link>
            </nav>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-5 w-5 mr-2" />
              Sign out
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}