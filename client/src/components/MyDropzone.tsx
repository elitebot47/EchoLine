// src/components/MyDropzone.tsx
import type { MessageCreateInput } from "@/lib/schemas/message";
import { useMessagesStore } from "@/stores/MessagesStore";
import { useSocketStore } from "@/stores/SocketStore";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, SendHorizontalIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface FileWithPreview extends File {
  id: string;
  preview: string;
}
const MyDropzone = ({
  toId,
  roomId,
  setUploadbox,
}: {
  toId: string;
  roomId: string;
  setUploadbox: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data: session } = useSession();

  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const socket = useSocketStore((state) => state.socket);
  const queryClient = useQueryClient();
  const addMessage = useMessagesStore((state) => state.addMessage);
  const replaceMessage = useMessagesStore((state) => state.replaceMessage);
  const [uploading, setUploading] = useState(false);

  async function HandleSendFiles() {
    setUploading(true);
    if (!toId) {
      toast.error("Error:Connection error ,please try again later");
      toast.error("Error while uploading:Recipient id missing");
      setUploading(false);
      setUploadbox(false);
      return;
    }
    try {
      const uploadpromises = Array.from(uploadedFiles).map(async (file) => {
        const formData = new FormData();
        if (!session?.user?.id) return;

        console.log(file.preview);
        let filetype;
        if (file.type.includes("image")) {
          formData.append("file", file);
          formData.append("upload_preset", "chat-app-room-image");
          filetype = "image";
        }

        addMessage({
          id: file.id,
          toId,
          roomId,
          fromId: session?.user?.id,
          content: file.preview,
          contentType: "image",
          updatedAt: new Date(),
          createdAt: new Date(),
        });
        setTimeout(() => {
          setUploadbox(false);
        }, 500);
        const res1 = await axios.post(`/api/fileupload/image`, formData);

        const res2 = await axios.post("/api/message/add", {
          content: res1.data.public_id,
          contentType: filetype,
          roomId,
          toId,
        } as MessageCreateInput);
        if (file?.id && res2?.data) {
          replaceMessage(file.id, res2.data);
        } else {
          console.error("Missing ID or message data", { file, res2 });
        }
        if (res2.data.isFirstMessage) {
          queryClient.invalidateQueries({
            queryKey: ["known-users"],

            refetchType: "active",
          });
        }

        socket?.emit("Chat_client", res2.data);
        setUploadedFiles([]);
      });
      const uploads = (await Promise.all(uploadpromises)).filter(Boolean);
      setUploadbox(false);
    } catch (error) {
      toast.error(`error:Failed to send message`);
    }
  }
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
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

    []
  );

  useEffect(() => {
    return () => {
      uploadedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
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
    maxFiles: 3,
    maxSize: 1024 * 1024 * 5,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
  });

  const dropzoneBorderColor = isDragAccept
    ? "border-green-500"
    : isDragReject
    ? "border-red-500"
    : "border-gray-300";

  useEffect(() => {
    return () => {
      uploadedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [uploadedFiles]);

  return (
    <AnimatePresence>
      <div>
        <motion.div
          layout
          transition={{ duration: 0.3 }}
          className="font-sans  overflow-hidden   w-[900px]   rounded-4xl"
        >
          <motion.div
            key={`upload-view-area`}
            layout
            transition={{ duration: 0.3 }}
            {...getRootProps({})}
            className={`flex flex-col items-center p-10  rounded-4xl border-dashed bg-gray-50/50 text-gray-800  outline-none transition-colors duration-200 cursor-pointer 
            ${dropzoneBorderColor} ${
              isDragActive
                ? "bg-gray-900/30 border-2 border-dashed backdrop-blur-lg "
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
                Only photos will be accepted!
              </p>
            )}
            {isDragReject && (
              <p className="text-red-500 mt-2">
                Audio,videos,documents will be rejected!
              </p>
            )}
          </motion.div>

          {fileRejections.length > 0 && (
            <div className="mt-5 text-red-500">
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
            <motion.div className="mt-5 ">
              <ul className="list-none  flex flex-wrap gap-4">
                {uploadedFiles.map((file) => (
                  <li
                    key={file.id}
                    className="border border-gray-200 rounded-4xl p-1 flex h-fit  justify-center  flex-col items-center max-w-[200px] text-center bg-gray-50/50"
                  >
                    <div className="relative">
                      <Button
                        onClick={() => {
                          const updatedFiles = uploadedFiles.filter(
                            (f) => f.id !== file.id
                          );
                          setUploadedFiles(updatedFiles);
                          URL.revokeObjectURL(file.preview);
                        }}
                        className={`top-2 right-2 backdrop-blur-md cursor-pointer bg-black/50 w-7 h-7  absolute rounded-full`}
                      >
                        <Plus className={`rotate-45 text-white  scale-125`} />
                      </Button>
                      <div>
                        {file.type.startsWith("image/") && (
                          <img
                            src={file.preview}
                            alt={file.name}
                            className=" w-auto max-h-[250px] max-w-[150px] h-fit  object-contain mb-1 rounded-4xl "
                            onError={(e) => {
                              (e.target as HTMLImageElement).onerror = null;
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/100x100?text=Error";
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <span className="text-[8px] mx-auto break-all overflow-wrap-anywhere">
                      {file.name}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>
        {uploadedFiles.length !== 0 && (
          <motion.div className=" flex justify-end items-center mr-3 mt-2">
            <Button
              key={"sendbutton"}
              className={` w-14 lg:w-16 lg:h-12 h-12 rounded-4xl cursor-pointer`}
              disabled={uploadedFiles.length === 0 || uploading}
              onClick={HandleSendFiles}
            >
              {<SendHorizontalIcon className={`scale-125`} />}
            </Button>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default MyDropzone;
