// src/components/MyDropzone.tsx
import { useMessagesStore } from "@/stores/MessagesStore";
import { useSocketStore } from "@/stores/SocketStore";
import type { Filetype } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, SendHorizontalIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "./ui/button";

export interface FileWithPreview extends File {
  id: string;
  preview: string;
}
const MyDropzone = ({
  uploading,
  setUploading,
  toId,
  roomId,
  setUploadbox,
}: {
  toId: string;
  roomId: string;
  setUploadbox: React.Dispatch<React.SetStateAction<boolean>>;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  uploading: boolean;
}) => {
  const { data: session } = useSession();

  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const socket = useSocketStore((state) => state.socket);
  const queryClient = useQueryClient();
  const addMessage = useMessagesStore((state) => state.addMessage);
  const replaceMessage = useMessagesStore((state) => state.replaceMessage);
  const isSendingRef = React.useRef(false);

  async function HandleSendFiles() {
    if (isSendingRef.current) return;
    isSendingRef.current = true;
    setUploading(true);

    if (!toId) {
      console.log("Error while uploading:Recipient id missing");

      setUploadbox(false);
      return;
    }
    try {
      const uploadPresets: Record<Filetype, string> = {
        image: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_ROOM_IMAGE!,
        document:
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_ROOM_DOCUMENT!,
      };
      const uploadpromises = Array.from(uploadedFiles).map(async (file) => {
        if (!session?.user?.id) return;
        const formData = new FormData();
        formData.append("file", file);

        let filetype: Filetype;

        if (file.type.startsWith("image/")) {
          filetype = "image";
        } else if (
          file.type.startsWith("application/") ||
          file.type.startsWith("text/")
        ) {
          filetype = "document";
        } else {
          filetype = "image";
        }
        formData.append("upload_preset", uploadPresets[filetype]);
        if (filetype === "image") {
          addMessage({
            id: file.id,
            toId,
            roomId,
            fromId: session?.user?.id,
            content: file.preview,
            contentType: filetype,
            updatedAt: new Date(),
            createdAt: new Date(),
          });
        }

        setUploadbox(false);

        const res1 = await axios.post(`/api/fileupload`, formData);

        const res2 = await axios.post("/api/message/add", {
          content: res1.data.public_id,
          contentType: filetype,
          roomId,
          toId,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        });

        if (filetype === "document") {
          addMessage({
            id: res2.data.message.id,
            toId,
            roomId,
            fromId: session?.user?.id,
            content: res2.data.message.content,
            contentType: "document",
            updatedAt: new Date(),
            createdAt: new Date(),
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
          });
        }
        filetype === "image" && replaceMessage(file.id, res2.data.message);
        if (res2.data.isFirstMessage) {
          queryClient.invalidateQueries({
            queryKey: ["known-users"],

            refetchType: "active",
          });
        }

        socket?.emit("Chat_client", res2.data.message);
        setUploadedFiles([]);
      });
      (await Promise.all(uploadpromises)).filter(Boolean);
      setUploadbox(false);
    } catch (error) {
      toast.error(`error:Failed to send message`);
      setUploading(false);
    } finally {
      isSendingRef.current = false;
      setUploading(false);
    }
  }
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (uploadedFiles.length + acceptedFiles.length > 4) {
        toast.error("Max upload allowed: 4");
        return;
      }
      const newFilesWithPreview: FileWithPreview[] = acceptedFiles.map((file) =>
        Object.assign(file, {
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}`,
          preview: URL.createObjectURL(file),
        })
      );
      setUploadedFiles((prevFiles) => [...prevFiles, ...newFilesWithPreview]);

      if (fileRejections.length > 0) {
        console.warn("Rejected files:", fileRejections);
      }
    },

    [uploadedFiles]
  );

  useEffect(() => {
    return () => {
      uploadedFiles.forEach((file) => {
        const images = document.images ? Array.from(document.images) : [];
        const stillInDOM = images.some((img) => img.src === file.preview);

        if (!stillInDOM) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [uploadedFiles]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop,
    maxFiles: 4,
    maxSize: 1024 * 1024 * 5,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
  });

  const dropzoneBorderColor = isDragAccept
    ? "border-green-500"
    : isDragReject
    ? "border-red-500"
    : "border-gray-300";

  return (
    <AnimatePresence mode="wait">
      <div>
        <motion.div
          layout="size"
          transition={{ duration: 0.2 }}
          className="font-sans  max-h-[500px]   w-full max-w-[900px] min-w-[500px]  overflow-hidden   rounded-2xl"
        >
          <motion.div
            key={`upload-view-area`}
            layout
            transition={{ duration: 0.2 }}
            {...getRootProps({})}
            className={`flex flex-col items-center p-10  rounded-2xl border-dashed bg-gray-50/50 text-gray-800   outline-none transition-colors duration-200 cursor-pointer 
              ${dropzoneBorderColor} ${
              isDragActive
                ? "bg-gray-900/30 border-2 w-[800px]   border-dashed  "
                : ""
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-white">Drop the files here ...</p>
            ) : (
              <div className="flex flex-col">
                <div>Drag files here, or click to select files</div>
                <div className="text-red-700 text-2xl justify-center items-center flex">
                  Photos only
                </div>
              </div>
            )}
            {isDragAccept && (
              <p className="text-green-500 mt-2">
                Only photos & documents will be accepted!
              </p>
            )}
            {isDragReject && (
              <p className="text-red-500 mt-2">
                Audio,videos will be rejected!
              </p>
            )}
          </motion.div>

          {fileRejections.length > 0 && (
            <div className="mt-5 text-red-800">
              <h4 className="font-bold text-lg mb-2">Rejected Files:</h4>
              <ul className="list-none p-0">
                {fileRejections.map(({ file, errors }) => (
                  <li key={file.name} className="mb-1">
                    <strong className="block">{file.name}</strong> (
                    {(file.size / 1024 / 1024).toFixed(2)} MB) -
                    <ul className="ml-4 text-sm">
                      {errors.map((e) => (
                        <li key={e.code}>{e.message}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <motion.div className="mt-2 ">
              <ul className="list-none  flex flex-wrap gap-2">
                {uploadedFiles.map((file) => (
                  <motion.li
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    key={file.id}
                    className="border border-gray-200 rounded-2xl p-1 flex h-fit  justify-center max-w-[200px]  flex-col items-center  text-center bg-gray-50/50"
                  >
                    <div className="relative">
                      <Button
                        className="absolute right-1 top-1 rounded-full flex justify-center items-center  cursor-pointer w-7 h-7 bg-black/70 backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          const previewUrl = file.preview;
                          setUploadedFiles((prev) =>
                            prev.filter((f) => f.id !== file.id)
                          );
                          requestAnimationFrame(() => {
                            const images = Array.from(document.images);
                            if (!images.some((img) => img.src === previewUrl)) {
                              URL.revokeObjectURL(previewUrl);
                            }
                          });
                        }}
                      >
                        <Plus className={`rotate-45 text-white scale-125`} />
                      </Button>
                      <div>
                        {file.type.startsWith("image/") && (
                          <img
                            src={file.preview}
                            alt={file.id}
                            className=" w-fit max-h-[250px]  h-fit  object-contain mb-1 rounded-2xl "
                          />
                        )}
                        {(file.type.startsWith("application/") ||
                          file.type.startsWith("text/")) && (
                          <div className="w-28 text-xs">
                            <div className="text-3xl">📝</div>
                            <div className="break-all">{file.name}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    {file.type.startsWith("image/") && (
                      <span className="text-[8px] break-all max-w-28  ">
                        {file.name}
                      </span>
                    )}
                  </motion.li>
                ))}
              </ul>
              <motion.div className=" flex justify-end items-center  mt-2">
                <Button
                  key={"sendbutton"}
                  className={`hover:scale-95 w-14 lg:w-16 lg:h-12 h-12 rounded-2xl cursor-pointer`}
                  disabled={uploadedFiles.length === 0 || uploading}
                  onClick={() => {
                    HandleSendFiles();
                  }}
                >
                  {<SendHorizontalIcon className={`scale-125`} />}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MyDropzone;
