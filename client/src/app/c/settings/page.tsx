"use client";
import type { FileWithPreview } from "@/components/MyDropzone";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/ui/spinner";
import axios from "axios";
import { Plus, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
export default function SettingPage() {
  const { data: session } = useSession();
  if (!session) {
    return <div>Not authenticated</div>;
  }
  const [imageviewdialog, setImageviewdialog] = useState(false);
  const [Imagepreviewdata, setImagepreviewdata] =
    useState<FileWithPreview | null>(null);
  const [imageUpdateLoader, setImageUpdateLoader] = useState(false);
  const avatarActionLoader = useRef<boolean>(false);

  async function ViewImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("currently in view async function");

    const fileSelect = e.target.files?.[0] || null;
    if (!fileSelect) {
      setImagepreviewdata(null);
      setImageviewdialog(false);
      return;
    }

    if (fileSelect.size > 1024 * 1024 * 4) {
      toast.error("Profile picture should be less than 4mb!");
      return;
    }
    const ImagePreview: FileWithPreview = Object.assign(fileSelect, {
      id: fileSelect.name,
      preview: URL.createObjectURL(fileSelect),
    });
    console.log(ImagePreview);

    setImagepreviewdata(ImagePreview);
    setImageviewdialog(true);
  }

  return (
    <div className="flex flex-col items-center gap-5 p-4">
      <div className="text-3xl">settings page</div>
      <div className="flex flex-col gap-3.5 justify-center items-center">
        {session.user?.image && (
          <Image
            className={`rounded-full`}
            width={120}
            height={120}
            alt={session.user.image}
            loading="lazy"
            src={`${session.user?.image}`}
          />
        )}
        <div className="flex gap-2">
          <div>
            <Button
              onClick={async () => {
                avatarActionLoader.current = true;
                try {
                  await axios.delete(`/api/user/avatar`, {
                    data: { Id: session.user?.id },
                  });
                  toast.success(
                    "Profile picture removed sucessfully,Changes may take time."
                  );
                } catch (error) {
                  toast.error(
                    "Error: Unable to remove profile picture,try again later"
                  );
                } finally {
                  avatarActionLoader.current = false;
                }
              }}
              variant={"destructive"}
              className="hover:bg-red-600/70  duration-500 cursor-pointer"
            >
              {avatarActionLoader.current ? (
                <Spinner size="lg" />
              ) : (
                "Delete Profile Picure"
              )}
            </Button>
          </div>
          <div>
            <Button
              asChild
              className="hover:bg-black/70  duration-500 cursor-pointer"
            >
              <Label htmlFor="file-upload" className="cursor-pointer">
                Change Profile Picure
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={ViewImagePreview}
                />
              </Label>
            </Button>
            <Dialog open={imageviewdialog} onOpenChange={setImageviewdialog}>
              <DialogTrigger asChild></DialogTrigger>
              <DialogContent className="bg-black/80">
                <DialogHeader className="mr-6">
                  <DialogTitle className="text-white">
                    {Imagepreviewdata?.id || "No File Selected"}
                  </DialogTitle>
                  <DialogDescription className="text-white">
                    {Imagepreviewdata &&
                      `File size: ${(Imagepreviewdata.size / 1024).toFixed(
                        2
                      )} KB`}
                  </DialogDescription>
                </DialogHeader>
                <div>
                  {Imagepreviewdata?.preview && (
                    <img
                      width={500}
                      height={500}
                      src={Imagepreviewdata.preview}
                      className="max-w-full h-auto object-contain mx-auto"
                    />
                  )}
                </div>

                <div className="flex flex-col ml-6 justify-end gap-2">
                  <Button
                    disabled={imageUpdateLoader}
                    className="cursor-pointer h-14 flex justify-center items-center hover:scale-105 hover:bg-red-400 bg-red-600"
                    onClick={() => setImageviewdialog(false)}
                  >
                    <div className="flex flex-col justify-center items-center ">
                      <Plus className="size-8 rotate-45"></Plus>
                      Cancel
                    </div>
                  </Button>

                  <Button
                    disabled={imageUpdateLoader}
                    variant="outline"
                    className="cursor-pointer flex justify-center items-center  h-14  hover:scale-105"
                    onClick={async () => {
                      try {
                        setImageUpdateLoader(true);
                        const formData = new FormData();
                        const upload_preset =
                          process.env
                            .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_USER_AVATAR;

                        if (!upload_preset) {
                          setImagepreviewdata(null);
                          toast.error(
                            "Error: Cloudinary upload preset is missing!"
                          );
                          return;
                        }
                        if (!Imagepreviewdata?.preview) {
                          setImagepreviewdata(null);

                          return;
                        }
                        formData.append("file", Imagepreviewdata);
                        formData.append("upload_preset", upload_preset);
                        await axios.post(`/api/user/avatar`, formData);
                        toast.success(
                          "Profile picture changed succesfully,changes may take hours to to be visible"
                        );
                        setImagepreviewdata(null);
                      } catch (error) {
                        toast.error(
                          "error while Updating profile!,try again later"
                        );
                        setImagepreviewdata(null);
                      } finally {
                        setImageUpdateLoader(true);

                        setImageviewdialog(false);
                      }
                    }}
                  >
                    <div>
                      {imageUpdateLoader ? (
                        <Spinner size="lg" />
                      ) : (
                        <div className="flex flex-col justify-center items-center">
                          <Upload className="size-8 " />
                          Upload
                        </div>
                      )}
                    </div>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            ;
          </div>
        </div>
      </div>
    </div>
  );
}
