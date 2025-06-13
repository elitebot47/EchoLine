"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMessagesStore } from "@/stores/MessagesStore";
import { useSocketStore } from "@/stores/SocketStore";
import axios from "axios";
import { AnimatePresence, easeIn, motion } from "framer-motion";
import { Ellipsis, X } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MessageStatus } from "../message/messageStatus";
import Spinner from "../ui/spinner";
export default function Message({
  MessageData,
  MyId,
}: {
  MessageData: any;
  MyId: string;
}) {
  const [imageloading, setImageloading] = useState(true);
  const [mine, setmine] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const deletedMessage = useMessagesStore((state) => state.deletedMessage);
  const socket = useSocketStore((state) => state.socket);
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
      className={` max-h-72 w-fit relative group  shadow-2xl backdrop-blur-md shadow-gray-400 border-0  flex flex-col  rounded-2xl ${
        MessageData.contentType === "image" && "h-auto "
      }
        ${
          mine
            ? "ml-auto bg-blue-900   pr-3 pl-3 pb-1 pt-1.5  text-white "
            : " bg-blue-600 pl-2 pr-3 pb-1 pt-1  text-white mr-auto"
        }`}
    >
      <div className="absolute  -left-12 top-1/2 transform -translate-y-1/2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-14 h-14 flex justify-center items-center cursor-pointer focus:outline-none focus:ring-0 focus:ring-offset-0 focus:bg-transparent">
            <Ellipsis className="group-hover:text-black hover:scale-125 focus:text-black text-transparent duration-300 transition-all " />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="left"
            className={`rounded-3xl translate-x-1`}
          >
            <DropdownMenuItem
              className="cursor-pointer rounded-2xl"
              onClick={async () => {
                setDeleting(true);

                try {
                  await axios.delete("/api/message/delete", {
                    data: {
                      id: MessageData.id,
                      publicId: MessageData.content,
                      type: MessageData.contentType,
                    },
                  });

                  deletedMessage(MessageData.id);
                  setDeleting(false);
                  socket?.emit("delete-message", {
                    id: MessageData.id,
                    roomId: MessageData.roomId,
                  });
                  toast.success("Message deleted successfully");
                } catch (error) {
                  setDeleting(false);

                  toast.error(`${error}`);
                  console.error("Delete failed:", error);
                }
              }}
            >
              Delete
            </DropdownMenuItem>
            {MessageData.contentType === "text" ||
            MessageData.contentType === "link" ? (
              <DropdownMenuItem className={`rounded-4xl cursor-pointer`}>
                Edit
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {MessageData.contentType === "image" &&
        MessageData.content?.startsWith("blob:") && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 rounded-2xl">
            <Spinner className="h-8 w-8 text-white" />
          </div>
        )}
      <div
        className={`${
          mine ? "self-end" : "self-start"
        }  font-medium text-lg overflow-hidden rounded-2xl`}
      >
        {MessageData.contentType === "link" && (
          <a
            className="text-gray-800  hover:underline underline-offset-2 break-all"
            href={MessageData.content}
            target="_blank"
            rel="noopener noreferrer"
          >
            {MessageData.content}
          </a>
        )}
        <div
          className={`${
            mine ? "self-end" : "self-start"
          } font-medium text-lg overflow-hidden rounded-2xl`}
        >
          {MessageData.contentType === "text" && (
            <div className="break-words max-w-full">{MessageData.content}</div>
          )}
        </div>
        {MessageData.contentType === "image" ? (
          MessageData.content?.startsWith("blob:") ? (
            <img
              width={300}
              height={300}
              src={MessageData.content}
              alt={MessageData.content || "Uploaded image"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
              className="rounded-lg  shadow-sm blur-xs transition-all  hover:shadow-md"
            />
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className="p-0 border-none bg-transparent cursor-pointer"
                  aria-label={`View ${MessageData.id || "image"} in fullscreen`}
                >
                  <CldImage
                    width={300}
                    height={300}
                    src={MessageData.content}
                    alt={MessageData.content || "Uploaded image"}
                    sizes="(max-width: 768px) 100vw, 300px"
                    quality={60}
                    crop="fit"
                    loading="lazy"
                    placeholder="empty"
                    className="rounded-lg shadow-sm transition-all hover:scale-105 hover:shadow-md"
                  />
                </button>
              </DialogTrigger>
              <DialogContent
                className="[&>button:last-child]:hidden 
                !max-w-none !w-screen !h-screen fixed inset-0 z-50 bg-black/95
                p-0 overflow-hidden flex items-center justify-center
                "
                onInteractOutside={(e) => e.preventDefault()}
              >
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3, ease: easeIn }}
                    className={`[&>button:last-child]:hidden 
                  !max-w-none !w-screen !h-screen fixed inset-0 z-50 bg-black/95
                  p-0 overflow-hidden flex items-center justify-center`}
                  >
                    <DialogHeader className="sr-only hidden">
                      <DialogTitle></DialogTitle>
                    </DialogHeader>
                    <div className="relative w-full h-full flex items-center justify-center">
                      {imageloading && <Spinner size="lg" />}
                      <CldImage
                        fill
                        priority
                        src={MessageData.content}
                        alt={MessageData.id || "Uploaded image"}
                        quality={100}
                        sizes="100vw"
                        className="object-contain"
                        draggable={false}
                        onLoad={() => setImageloading(false)}
                      />

                      <DialogClose className="cursor-pointer absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80">
                        <X className="w-8 h-8" />
                      </DialogClose>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </DialogContent>
            </Dialog>
          )
        ) : null}
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
