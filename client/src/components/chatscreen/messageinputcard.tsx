"use client";

import { SendHorizontalIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function MessageInputCard() {
  return (
    <div className="flex w-full justify-center items-center border-2 h-full">
      <div className="flex-9 ">
        <Input  />
      </div>

      <div className="flex-1  ">
        <Button >
          <SendHorizontalIcon />
        </Button>
      </div>
    </div>
  );
}
