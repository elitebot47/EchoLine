"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MessageStatus } from "../message/messageStatus";

export default function Message({
  MessageData,
  MyId,
}: {
  MessageData: any;
  MyId: string;
}) {
  const [mine, setmine] = useState(false);
  useEffect(() => {
    const mine = MyId === MessageData.fromId;
    setmine(mine);
  }, [MyId]);

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
        {MessageData.contentType === "link" ? (
          <a
            className="text-gray-800  hover:underline underline-offset-2 break-all"
            href={MessageData.content}
            target="_blank"
            rel="noopener noreferrer"
          >
            {MessageData.content}
          </a>
        ) : (
          <div>{MessageData.content}</div>
        )}
      </div>
      <div className="self-end flex items-center">
        <div
          className={`
             "self-end" 
            font-light text-xs text-[10px]`}
        >
          {time}
        </div>
        <div>
          <MessageStatus status={`SENT`}></MessageStatus>
        </div>
      </div>
    </motion.div>
  );
}
