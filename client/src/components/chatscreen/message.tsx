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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useSocketStore } from "@/stores/SocketStore";
import type { MessageType, MinimalMessage } from "@/types";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import clsx from "clsx";
import { AnimatePresence, easeIn, motion } from "framer-motion";
import { Ellipsis, FileDown, X } from "lucide-react";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { toast } from "sonner";
import { MessageStatus } from "../message/messageStatus";
import Spinner from "../ui/spinner";
export default function Message({
  MessageData,
  MyId,
}: {
  MessageData: MessageType;
  MyId: string;
}) {
  const [imageloading, setImageloading] = useState(true);
  const [isMine, setisMine] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const socket = useSocketStore((state) => state.socket);
  const type = MessageData.contentType;
  useEffect(() => {
    const isMine = MyId === MessageData.fromId;
    setisMine(isMine);
  }, [MyId, MessageData.fromId]);
  const queryClient = useQueryClient();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`lg:max-h-72 max-h-64  ${
        deleting ? "  blur-[3px] cursor-not-allowed pointer-events-none " : ""
      } w-fit max-w-60 lg:max-w-[60%]  relative group shadow-lg backdrop-blur-md shadow-gray-400 border-0 flex flex-col rounded-2xl
    ${type === "image" ? "p-1" : "px-2 py-2"}
    ${
      isMine
        ? "ml-auto rounded-br-none bg-black/80 text-white"
        : "mr-auto rounded-bl-none"
    }`}
    >
      <div
        className={`absolute   ${
          isMine
            ? "-left-12 top-1/2 transform -translate-y-1/2"
            : "-right-12 top-1/2 transform -translate-y-1/2"
        }   z-10`}
      >
        <MessageOptions
          queryClient={queryClient}
          MessageData={MessageData}
          setDeleting={setDeleting}
          socket={socket}
          MyId={MyId}
          isMine={isMine}
        />
      </div>

      <div
        className={`  overflow-hidden ${
          type === "image" ? "rounded-2xl" : "rounded-none"
        } `}
      >
        <DocumentContent MessageData={MessageData} />
        <ImageContent
          MessageData={MessageData}
          imageloading={imageloading}
          setImageloading={setImageloading}
        />
        <div className={`${isMine ? "self-end" : "self-start"} `}>
          <LinkContent MessageData={MessageData} />
          <TextContent MessageData={MessageData} isMine={isMine} />
        </div>
      </div>

      <MessageFooter time={MessageData.createdAt} />
    </motion.div>
  );
}

// ---------------------------------------------------------------------
function MessageFooter({ time }: { time: Date }) {
  const [createdAt, setCreatedAt] = useState("");

  useEffect(() => {
    setCreatedAt(
      time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    );
  }, [time]);

  return (
    <div className=" self-end flex h-2 mt-1  items-center">
      <div
        className={`
             "self-end" 
            font-light text-xs text-[10px]`}
      >
        {createdAt}
      </div>
      <div>
        <MessageStatus status={`DELIVERED`}></MessageStatus>
      </div>
    </div>
  );
}
// ---------------------------------------------------------------------
function DocumentContent({ MessageData }: { MessageData: MessageType }) {
  return (
    <div className={`  overflow-hidden `}>
      {MessageData.contentType === "document" && (
        <div className=" flex items-center gap-1.5 ">
          <a
            className="hover:scale-105 duration-500 hover:text-red-700 flex items-center  "
            href={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload/${MessageData.content}`}
          >
            <div>
              <FileDown className="size-10" />
            </div>
          </a>
          <div className={`flex flex-col`}>
            <div className={`mr-1.5 text-sm  `}>{MessageData.fileName}</div>
            {MessageData.fileSize && (
              <div className={`text-xs`}>
                {(MessageData.fileSize / (1024 * 1024)).toFixed(2)}MB
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
function BlobImagePreview({ MessageData }: { MessageData: MessageType }) {
  return (
    <Image
      width={300}
      height={300}
      loading="eager"
      src={MessageData.content}
      alt={MessageData.content || "Uploaded image"}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
      className="  shadow-sm blur-xs transition-all  hover:shadow-md"
    />
  );
}
// ---------------------------------------------------------------------------
function LinkContent({ MessageData }: { MessageData: MessageType }) {
  return (
    <div>
      <HoverCard openDelay={50}>
        <HoverCardTrigger asChild>
          {MessageData.contentType === "link" && (
            <a
              className="text-yellow-300  underline underline-offset-5 break-all"
              href={MessageData.content}
              target="_blank"
              rel="noopener noreferrer"
            >
              {MessageData.content}
            </a>
          )}
        </HoverCardTrigger>
        <HoverCardContent
          className={` text-sm m-1 text-nowrap p-2 bg-white/70 backdrop-blur-lg rounded-lg w-fit text-red-500`}
        >
          <span className="text-sm font-medium"> Caution: </span>
          <span className="text-sm">Link can be malicious</span>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
// ---------------------------------------------------------------------------
function TextContent({
  MessageData,
  isMine,
}: {
  MessageData: MessageType;
  isMine: boolean;
}) {
  return (
    <div
      className={`${
        isMine ? "self-end" : "self-start"
      } font-medium text-2xl overflow-hidden `}
    >
      {MessageData.contentType === "text" && (
        <div className="break-words ">{MessageData.content}</div>
      )}
    </div>
  );
}
// ---------------------------------------------------------------------------

function ImageContent({
  MessageData,
  imageloading,
  setImageloading,
}: {
  MessageData: MessageType;
  imageloading: boolean;
  setImageloading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div>
      {MessageData.contentType === "image" &&
        MessageData.content?.startsWith("blob:") && (
          <div className="absolute inset-0 z-20 flex rounded-2xl items-center justify-center  ">
            <Spinner className="h-8 w-8 text-white" />
          </div>
        )}
      {MessageData.contentType === "image" ? (
        MessageData.content?.startsWith("blob:") ? (
          <BlobImagePreview MessageData={MessageData} />
        ) : (
          <ImagePreview
            MessageData={MessageData}
            imageloading={imageloading}
            setImageloading={setImageloading}
          />
        )
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
function ImagePreview({
  MessageData,
  imageloading,
  setImageloading,
}: {
  MessageData: MessageType;
  imageloading: boolean;
  setImageloading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
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
          className=" shadow-sm transition-all duration-500 cursor-zoom-in hover:scale-105 hover:shadow-md"
        />
      </DialogTrigger>
      <DialogContent
        className="[&>button:last-child]:hidden 
                !max-w-none !w-screen !h-screen fixed inset-0 z-50 bg-black/95
                p-0 overflow-hidden flex items-center justify-center
                "
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
  );
}
// -----------------------------------------------------------------
function MessageOptions({
  MessageData,
  MyId,
  socket,
  setDeleting,
  isMine,
  queryClient,
}: {
  queryClient: QueryClient;
  MessageData: MessageType;
  MyId: string;
  socket: Socket | null;
  setDeleting: React.Dispatch<React.SetStateAction<boolean>>;
  isMine: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-14 h-14 flex justify-center items-center cursor-pointer focus:outline-none focus:ring-0 focus:ring-offset-0 focus:bg-transparent">
        <Ellipsis className="group-hover:text-black hover:scale-110 focus:text-black text-transparent duration-300 transition-all " />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={`${isMine ? "left" : "right"}`}
        className={`rounded-2xl translate-x-1`}
      >
        <DropdownMenuItem
          className={clsx("cursor-pointer", "rounded-2xl", {
            hidden: MessageData.fromId !== MyId,
          })}
          onClick={async () => {
            setDeleting(true);

            try {
              await axios.delete("/api/message/delete", {
                data: {
                  id: MessageData.id,
                  type: MessageData.contentType,
                },
              });
              queryClient.setQueryData(
                ["messages", MessageData.roomId],
                (old = []) =>
                  (old as MinimalMessage[]).filter(
                    (msg) => msg.id != MessageData.id,
                  ),
              );
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
          <DropdownMenuItem
            className={clsx("cursor-pointer", "rounded-2xl", {
              // hidden: MessageData.fromId !== MyId,
            })}
          >
            Edit
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
