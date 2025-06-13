export function generateRandomAvatarUrl(): string {
  const seed = crypto.randomUUID();
  return `https://api.dicebear.com/7.x/bottts/png?seed=${seed}`;
}
