"use client";
import { MessageType } from "@/types";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
export default function Message({
  MessageData,
  Session,
}: {
  MessageData: MessageType;
  Session: Session | null;
}) {
  const [mine, setmine] = useState(false);
  useEffect(() => {
    const mine = Session?.user?.id === MessageData.from;
    setmine(mine);
    console.log(mine);
  }, [Session]);
  const time = new Date(MessageData.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`w-fit shadow-2xl backdrop-blur-md shadow-gray-400 border-0  flex flex-col  rounded-xl ${
        mine
          ? "ml-auto bg-blue-900 pr-2 pl-3 pb-1 pt-1.5  text-white "
          : " bg-blue-600 pl-2 pr-3 pb-1 pt-1  text-white mr-auto"
      }`}
    >
      <div
        className={`${mine ? "self-end" : "self-start"}  font-medium text-lg`}
      >
        {MessageData.content}
      </div>
      <div
        className={`${
          mine ? "self-end" : "self-start"
        }  font-light text-xs text-[10px]`}
      >
        {time}
      </div>
    </motion.div>
  );
}
