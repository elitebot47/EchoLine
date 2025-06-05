"use client";
import { MessageType } from "@/types";
import { Session } from "next-auth";
import { useEffect, useState } from "react";

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
    <div className={`w-fit  ${mine ? "ml-auto" : "mr-auto"}`}>
      {MessageData.content}
    </div>
  );
}
