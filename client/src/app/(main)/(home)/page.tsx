import { auth } from "@/auth";

export default async function Homepage() {
  const session = await auth();
  return (
    <div>
      <div>hi {session?.user?.name}</div>
      this is videocall-chat app homepage
    </div>
  );
}
