"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, MenuIcon, Plus, PlusIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { UserType } from "@/types";
import UserCard from "./usercard";
import SettingPage from "@/app/settings/page";

export default function AccessibilityCard({
  user,
  users,
}: {
  user: any;
  users: any;
}) {
  console.log("users from assec card:");

  const [inputtext, setInputtext] = useState("");
  const UsersRef = useRef(users.filter((User: any) => User.id != user.id));
  const [SearchedUsers, setSearchedUsers] = useState<UserType[]>([]);
  const [Searchpanel, setSearchpanel] = useState(false);
  const [settingpage, setSettingpage] = useState(false);

  useEffect(() => {
    if (!inputtext.trim()) {
      setSearchedUsers([]);
      return;
    }
    const timout = 400;
    let searchtimeout;
    if (searchtimeout) {
      clearTimeout(searchtimeout);
    }
    searchtimeout = setTimeout(() => {
      setSearchedUsers(
        UsersRef.current.filter((user) =>
          user.name.toLowerCase().includes(inputtext.toLowerCase())
        )
      );
    }, timout);

    return () => {
      clearTimeout(searchtimeout);
    };
  }, [inputtext]);

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
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Saved Chats</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>

                <Dialog>
                  <DialogTrigger className="w-full">
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className={` hover:!bg-red-500 hover:!text-white text-red-500`}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This will log you out of your account.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
                      <DialogClose asChild>
                        <Button>cancel</Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          signOut({ callbackUrl: "/signin" });
                          toast.info("Logging out...");
                        }}
                      >
                        Logout
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        ) : (
          <motion.div
            key={"closebutton"}
            initial={{ rotate: 45, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 45, opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <Button
              onClick={() => {
                setSearchpanel(false);
                setInputtext("");
              }}
              className="group flex w-10 h-10 justify-center items-center rounded-full  cursor-pointer "
            >
              <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-0.5 group-hover:scale-105 " />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div transition={{ duration: 0.5 }} className={`w-full px-3 `}>
        <Input
          onChange={(e) => setInputtext(e.target.value)}
          onClick={() => {
            setSearchpanel(true);
          }}
          value={inputtext}
          className=" rounded-full  font-medium w-full"
          type="search"
        />
      </motion.div>
      <AnimatePresence>
        {Searchpanel && (
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden h-[93vh] origin-left absolute left-0 top-full  w-full  bg-white shadow-lg border z-10"
          >
            {SearchedUsers.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center  "
              >
                {!inputtext ? "Search people here😊" : "No users found"}
              </motion.div>
            )}
            {SearchedUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <UserCard user={user} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
