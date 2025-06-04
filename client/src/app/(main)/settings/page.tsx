import { auth } from "@/auth";

export default async function SettingPage() {
  const session = await auth();
  return (
    <div>
      <div>hi {session?.user?.name}</div>
      settings page
    </div>
  );
}
