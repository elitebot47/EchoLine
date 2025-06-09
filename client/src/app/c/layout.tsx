import ResponsiveChatLayout from "@/components/chatscreen/ResponsiveChatLayout";
import { getUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const User = await getUser();
  if (!User) {
    return <div>Not authenticated</div>;
  }
  const users = await prisma.user.findMany({
    select: { id: true, name: true },
  });

  return <ResponsiveChatLayout users={users}>{children}</ResponsiveChatLayout>;
}
