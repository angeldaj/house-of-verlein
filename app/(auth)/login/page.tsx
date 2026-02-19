import { Suspense } from "react";
import LoginClient from "./_components/login-client";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginClient />
    </Suspense>
  );
}

function LoginSkeleton() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div className="h-9 w-44 rounded-xl bg-secondary/50" />
          <div className="h-9 w-28 rounded-full bg-secondary/50" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <div className="h-6 w-28 rounded-full bg-secondary/50" />
            <div className="h-10 w-64 rounded-xl bg-secondary/50" />
            <div className="h-4 w-80 rounded-xl bg-secondary/50" />
            <div className="h-40 rounded-3xl bg-secondary/30" />
          </div>
          <div className="h-115 rounded-3xl bg-secondary/30" />
        </div>
      </main>
    </div>
  );
}
