import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import ClientDashboard from "./_components/client-dashboard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?next=/dashboard");

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      createdAt: true,
      subscriptionStatus: true,
      subscriptionCurrentPeriodEnd: true,
    },
  });

  if (!user) redirect("/login?next=/dashboard");

  const downloadsCount = await prisma.download.count({ where: { userId } });

  const recentDownloads = await prisma.download.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      beat: { select: { id: true, title: true, bpm: true, genre: true, mood: true } },
    },
  });

  return (
    <ClientDashboard
      data={{
        user: {
          name: user.name ?? null,
          email: user.email,
          createdAtISO: user.createdAt.toISOString(),
        },
        membership: {
          status: (user.subscriptionStatus ?? session.user.subscriptionStatus) as
            | "INACTIVE"
            | "ACTIVE"
            | "PAST_DUE"
            | "CANCELED",
          currentPeriodEndISO: user.subscriptionCurrentPeriodEnd
            ? user.subscriptionCurrentPeriodEnd.toISOString()
            : null,
        },
        downloads: {
          total: downloadsCount,
          recent: recentDownloads.map((d) => ({
            id: d.id,
            createdAtISO: d.createdAt.toISOString(),
            beat: {
              id: d.beat.id,
              title: d.beat.title,
              bpm: d.beat.bpm ?? null,
              genre: d.beat.genre ?? null,
              mood: d.beat.mood ?? null,
            },
          })),
        },
      }}
    />
  );
}
