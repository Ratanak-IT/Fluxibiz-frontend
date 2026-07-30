"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link2, Pencil, User } from "lucide-react"

const connectedProviders = [
  {
    name: "Google",
    email: "emma.j@gmail.com",
    connected: true,
    icon: (
      <svg viewBox="0 0 24 24" className="size-5">
        <path
          fill="#4285F4"
          d="M23.5 12.27c0-.82-.07-1.6-.2-2.36H12v4.47h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.87c2.27-2.09 3.56-5.17 3.56-8.73Z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1C3.24 21.3 7.3 24 12 24Z"
        />
        <path
          fill="#FBBC05"
          d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.27a12 12 0 0 0 0 10.78l4-3.1Z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.3 0 3.24 2.7 1.27 6.61l4 3.1C6.22 6.86 8.87 4.75 12 4.75Z"
        />
      </svg>
    ),
  },
  {
    name: "Facebook",
    email: "emma.j@gmail.com",
    connected: true,
    icon: (
      <svg viewBox="0 0 24 24" className="size-5">
        <path
          fill="#1877F2"
          d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.25h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07Z"
        />
        <path
          fill="#fff"
          d="M16.67 15.56 17.2 12.07h-3.32V9.82c0-.96.46-1.89 1.95-1.89h1.51V4.96s-1.37-.24-2.68-.24c-2.74 0-4.53 1.67-4.53 4.69v2.66H7.08v3.49h3.05V24a12.2 12.2 0 0 0 3.75 0v-8.44h2.79Z"
        />
      </svg>
    ),
  },
]

export default function UserProfile() {
  const [firstName, setFirstName] = useState("Emma")
  const [lastName, setLastName] = useState("Johnson")
  const [email, setEmail] = useState("emma.johnson@email.com")
  const [phone, setPhone] = useState("+1 (415) 555-7284")

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6 2xl:max-w-[1400px]">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8 flex items-center gap-6">
            <div className="relative shrink-0">
              <Avatar className="size-28 border-2 border-white shadow-sm sm:size-32 dark:border-border">
                <AvatarImage src="https://github.com/shadcn.png" alt="Emma Johnson" />
                <AvatarFallback className="text-2xl">EJ</AvatarFallback>
              </Avatar>
              <button
                type="button"
                aria-label="Update profile photo"
                className="absolute bottom-1 right-1 flex size-9 items-center justify-center rounded-full bg-green-600 text-white shadow-sm ring-2 ring-gray-50 transition-colors hover:bg-green-700 dark:bg-primary dark:ring-background"
              >
                <Pencil className="size-4" />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 sm:text-3xl dark:text-foreground">
                Emma Johnson
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                Manage your account settings
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Personal Information */}
            <Card className="border-0 p-0 shadow-sm">
              <CardContent className="p-5 sm:p-6">
                <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-neutral-900 dark:text-foreground">
                  <User className="size-4 text-green-600 dark:text-primary" />
                  Personal Information
                </h2>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-11 rounded-full px-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-11 rounded-full px-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 rounded-full px-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-11 rounded-full px-4"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Connected Accounts */}
            <Card className="border-0 p-0 shadow-sm">
              <CardContent className="p-5 sm:p-6">
                <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-neutral-900 dark:text-foreground">
                  <Link2 className="size-4 text-green-600 dark:text-primary" />
                  Connected Accounts
                </h2>

                <div className="divide-y divide-neutral-100 dark:divide-border">
                  {connectedProviders.map(({ name, email, connected, icon }) => (
                    <div
                      key={name}
                      className="flex flex-col items-start justify-between gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-md border border-neutral-200 bg-white dark:border-border">
                          {icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-foreground">
                            {name}
                          </p>
                          <p className="text-sm text-muted-foreground">{email}</p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className={
                          connected
                            ? "rounded-full border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-600 dark:border-destructive/30 dark:bg-destructive/10 dark:text-destructive dark:hover:bg-destructive/20"
                            : "rounded-full bg-green-600 text-white hover:bg-green-700 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                        }
                      >
                        {connected ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button className="h-11 rounded-full bg-green-600 px-6 font-semibold text-white hover:bg-green-700 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}