"use client";

import { useShowChatStore } from "@/stores/showChatStore";
import { useSocketStore } from "@/stores/SocketStore";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import CustomAvatar from "../ui/customavatar";
export default function ChatScreenHeader({
  user,
  roomId,
}: {
  user: { id: string; name: string; image?: string | null };
  roomId: string;
}) {
  // const { data: session } = useSession();
  const Chat = useShowChatStore((state) => state.showChat);
  const setChat = useShowChatStore((state) => state.setShowChat);
  const socket = useSocketStore((state) => state.socket);
  const [Typingstatus, setTypingstatus] = useState(false);

  useEffect(() => {
    if (!socket || !user) return;

    let typingTimeout: NodeJS.Timeout | undefined;

    const handler = () => {
      setTypingstatus(true);
      if (typingTimeout) clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => setTypingstatus(false), 1000);
    };

    socket.on("UserTypingStatus", handler);

    return () => {
      socket.off("UserTypingStatus", handler);
      if (typingTimeout) clearTimeout(typingTimeout);
      setTypingstatus(false);
    };
  }, [socket, roomId, user]);
  return (
    <div className="text-2xl px-4 h-full bg-black/20  items-center flex w-full ">
      <div className="mr-4 block lg:hidden ">
        {Chat && (
          <Button
            className="cursor-pointer"
            onClick={() => {
              setChat(false);
            }}
          >
            <ArrowLeft />
          </Button>
        )}
      </div>
      <div className="h-full items-center flex gap-2">
        <div>
          {user.image && (
            <CustomAvatar
              className={`rounded-full`}
              width={50}
              height={50}
              alt={user.image}
              src={`${user?.image}`}
            />
          )}
        </div>
        <motion.div layout className="flex   h-full justify-center flex-col ">
          <AnimatePresence mode="sync">
            <motion.div
              key={"user-name"}
              className={clsx(
                "duration-300 text-3xl  ",
                " text-center flex justify-center items-center "
              )}
            >
              {user.name}
            </motion.div>
            {Typingstatus && (
              <motion.div
                key={"typing-text"}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                className="flex justify-start items-center text-sm mb-2 mt-0 pt-0 font-semibold text-black"
              >
                Typing...
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
