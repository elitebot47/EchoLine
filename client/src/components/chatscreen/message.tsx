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
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`w-fit  ${mine ? "ml-auto" : "mr-auto"}`}
    >
      {MessageData.content}
    </motion.div>
  );
}
