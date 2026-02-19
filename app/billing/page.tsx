import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import BillingClient from "./_components/billing-client";

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?next=/billing");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      subscriptionStatus: true,
      subscriptionCurrentPeriodEnd: true,
    },
  });

  if (!user) redirect("/login?next=/billing");

  return (
    <BillingClient
      data={{
        name: user.name ?? null,
        email: user.email ?? "",
        status: (user.subscriptionStatus ?? session.user.subscriptionStatus) as
          | "INACTIVE"
          | "ACTIVE"
          | "PAST_DUE"
          | "CANCELED",
        currentPeriodEndISO: user.subscriptionCurrentPeriodEnd
          ? user.subscriptionCurrentPeriodEnd.toISOString()
          : null,
      }}
    />
  );
}
