"use client";

import type { MessageCreateInput } from "@/lib/schemas/message";
import { useMessagesStore } from "@/stores/MessagesStore";
import { useSocketStore } from "@/stores/SocketStore";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { find } from "linkifyjs";
import { LucidePaperclip, Plus, SendHorizonalIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import type { Socket } from "socket.io-client";
import { toast } from "sonner";
import MyDropzone from "../MyDropzone";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type MinimalParticipant = { user: { id: string; name: string } };

type MessageInputCardProps = {
  id: string;
  participants: MinimalParticipant[];
};
export default function MessageInputCard({
  id,
  participants,
}: MessageInputCardProps) {
  const { data: session } = useSession();

  const socket = useSocketStore((state) => state.socket);
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState<boolean>(false);

  const addMessage = useMessagesStore((state) => state.addMessage);
  const [chattext, setchattext] = useState("");

  const [uploadbox, setUploadbox] = useState(false);

  const recipient = participants.find(
    (user) => user.user.id !== session?.user?.id
  );
  console.log("recipient:", recipient);

  async function HandleSend() {
    if (!chattext) {
      return;
    }

    const links = find(chattext.trim());

    const detectedContentType =
      links.length > 0 &&
      links[0].type === "url" &&
      links[0].value == chattext.trim()
        ? "link"
        : "text";

    try {
      if (!recipient) {
        toast.error("Error:recipient error ,please try again later");
        return;
      }
      const res = await axios.post("/api/message/add", {
        content: String(chattext),
        contentType: String(detectedContentType),
        roomId: String(id),
        toId: String(recipient.user.id),
      } as MessageCreateInput);
      if (res.data.message) {
        addMessage(res.data.message);
      }
      if (res.data.isFirstMessage) {
        queryClient.invalidateQueries({
          queryKey: ["known-users"],
        });
      }
      console.log("now sending socket message to other user");
      console.log(res.data.message);

      socket?.emit("Chat_client", res.data.message);
      console.log("socket message recived");
      setchattext("");
    } catch (error) {
      console.log(error);

      toast.error(`error:${error}`);
    }
  }

  return (
    <div className="flex w-full bg-white shadow-lg border-2 border-l-0  shadow-black gap-2 justify-center items-center relative p-2 h-full">
      <TextInputField
        uploading={uploading}
        chattext={chattext}
        uploadbox={uploadbox}
        setchattext={setchattext}
        socket={socket}
        id={id}
        HandleSend={HandleSend}
      />
      <AnimatePresence mode="popLayout">
        <motion.div key={"attach-button"}>
          <AttachButton uploading={uploading} setUploadbox={setUploadbox} />
        </motion.div>
        {uploadbox
          ? null
          : chattext.length !== 0 && (
              <SendButton
                key={"send-button-container"}
                HandleSend={HandleSend}
              />
            )}

        {uploadbox && (
          <UploadBox
            key={"upload-box"}
            recipient={recipient}
            RoomId={id}
            uploading={uploading}
            setUploadbox={setUploadbox}
            setUploading={setUploading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// -------------------------------------------------------------------------------------------------------------------------
// ---------------------- Upload box close button
function UploadBox({
  setUploadbox,
  recipient,
  uploading,
  setUploading,
  RoomId,
}: {
  setUploadbox: React.Dispatch<React.SetStateAction<boolean>>;
  recipient: any;
  uploading: boolean;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  RoomId: string;
}) {
  return (
    <motion.div
      layout
      initial={{ y: 50, x: 80, opacity: 0, height: 0 }}
      animate={{ y: 0, x: 0, opacity: 1, height: "auto" }}
      exit={{ y: 50, x: 80, opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={`    overflow-hidden  absolute  flex flex-col  gap-2 bottom-full shadow-2xl z-50 shadow-black/50 bg-black/50 backdrop-blur-xl  p-2 rounded-2xl`}
    >
      <div className="flex justify-end ">
        <UploadBoxClosebutton setUploadbox={setUploadbox} />
      </div>
      <div>
        <MyDropzone
          uploading={uploading}
          setUploading={setUploading}
          roomId={String(RoomId)}
          toId={String(recipient?.user.id)}
          setUploadbox={setUploadbox}
        />
      </div>
    </motion.div>
  );
}
// ---------------------- Attach button
function AttachButton({
  setUploadbox,
  uploading,
}: {
  setUploadbox: React.Dispatch<React.SetStateAction<boolean>>;
  uploading: boolean;
}) {
  return (
    <Button
      aria-label="Attach File"
      disabled={uploading}
      onClick={() => setUploadbox(true)}
      size={"icon"}
      title="Attach"
      className="hover:scale-105 lg:w-16 lg:h-10 w-14 h-12  cursor-pointer"
    >
      <LucidePaperclip />
    </Button>
  );
}
// ---------------------- Upload box close button
function UploadBoxClosebutton({
  setUploadbox,
}: {
  setUploadbox: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Button
      onClick={() => {
        setUploadbox(false);
      }}
      className="rounded-2xl hover:scale-105 bg-black/50 backdrop-blur-lg cursor-pointer w-12 h-9"
    >
      <Plus className="rotate-45 size-6" />
    </Button>
  );
}
// --------------------------SendButton
function SendButton({ HandleSend }: { HandleSend: () => void }) {
  return (
    <motion.div
      className=" origin-right"
      initial={{ opacity: 0, scaleX: 0.6 }}
      exit={{ opacity: 0, scaleX: 0.6 }}
      animate={{
        opacity: 1,
        scaleX: 1,
        transition: {},
      }}
      transition={{ duration: 0.2 }}
    >
      <Button
        className="w-14 hover:scale-105 lg:w-16 lg:h-10 h-12 cursor-pointer"
        onClick={HandleSend}
        title="send"
      >
        <SendHorizonalIcon />
      </Button>
    </motion.div>
  );
}
// ----------------------text field
function TextInputField({
  chattext,
  uploadbox,
  setchattext,
  socket,
  id,
  HandleSend,
  uploading,
}: {
  chattext: string;
  uploadbox: boolean;
  setchattext: React.Dispatch<React.SetStateAction<string>>;
  socket: Socket | null;
  id: string;
  HandleSend: () => void;
  uploading: boolean;
}) {
  return (
    <Input
      disabled={uploadbox || uploading}
      className=" rounded-full shadow-none   lg:rounded-none  h-full w-full lg:!text-xl !text-2xl
         focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-0 focus:outline-none hover:ring-0 ring-0 border-0 bg-transparent  text-black"
      value={chattext}
      onChange={(e) => {
        setchattext(e.target.value);
        if (e.target.value) {
          socket?.emit("UserTyping", { roomId: id });
        }
      }}
      onKeyDown={(e) => e.key === "Enter" && HandleSend()}
    />
  );
}
