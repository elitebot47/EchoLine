import { getUser } from "@/lib/dal";

export default async function SettingPage() {
  const user = await getUser();
  if (!user) {
    return <div>Not authenticated</div>;
  }
  return <div>settings page</div>;
}
