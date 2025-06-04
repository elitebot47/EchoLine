import ChatViewArea from "@/components/chatscreen/chatviewarea";
import MessageInputCard from "@/components/chatscreen/messageinputcard";

export default async function ChatViewPage({
  params,
}: {
  params: Promise<{ userid: string }>;
}) {
  const { userid } = await params;
  return (
    <div className="flex-col flex h-screen w-full">
      <div className="flex-1 w-full">{userid}</div>
      <div className="flex-9 w-full">
        <ChatViewArea />
      </div>
      <div className="flex-1 w-full">
        <MessageInputCard />
      </div>
    </div>
  );
}
