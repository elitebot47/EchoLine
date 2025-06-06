"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon, Plus, PlusIcon } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useState } from "react";
// import Link from "next/link";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";

export default function AccessibilityCard({
  Session,
}: {
  Session: Session | null;
}) {
  const [Searchpanel, setSearchpanel] = useState(false);
  return (
    <div className="flex h-12 relative  w-full items-center px-2">
      <AnimatePresence mode="wait">
        {!Searchpanel ? (
          <motion.div
            key={"menubutton"}
            initial={{ rotate: -45, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -45, opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger className="  cursor-pointer ring-0 focus:ring-0 focus:border-0 border-0 hover:border-0 hover:ring-0 flex justify-center items-center ">
                <MenuIcon className="hover:scale-110 duration-500" size={35} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{Session?.user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Saved Chats</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    signOut({ callbackUrl: "/signin" });
                    toast.info("Logging out...");
                  }}
                  className={` hover:!bg-red-500 hover:!text-white text-red-500`}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        ) : (
          <motion.div
            key={"closebutton"}
            initial={{ rotate: 45, opacity: 0 }}
            animate={{ rotate: -45, opacity: 1 }}
            exit={{ rotate: 45, opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <Button
              onClick={() => {
                setSearchpanel(false);
              }}
              className="group flex w-10 h-10 justify-center items-center rounded-full  cursor-pointer "
            >
              <PlusIcon className="size-5 transition-transform group-hover:scale-125 " />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="w-full   px-3">
        <Input
          onClick={() => {
            setSearchpanel(true);
          }}
          className=" rounded-full text-2xl font-medium w-full"
          type="search"
        />
      </div>
      <AnimatePresence>
        {Searchpanel && (
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-[93vh] origin-left absolute left-0 top-full  w-full  bg-white shadow-lg border z-10"
          >
            <div className="p-4">this is the search panel</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
