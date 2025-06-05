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

  return (
    <motion.div
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`w-fit border-2 px-5 py-2 rounded-3xl ${
        mine
          ? "ml-auto bg-blue-900 text-white "
          : " bg-blue-600 text-white mr-auto"
      }`}
    >
      {MessageData.content}
    </motion.div>
  );
}
