"use client";

import AccessibilityCard from "@/components/chatscreen/accessibilitycard";
import UserList from "@/components/chatscreen/userlist";
import { useMobileStore } from "@/stores/isMobileStore";
import { useShowChatStore } from "@/stores/showChatStore";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useMediaQuery as ReactResponsiveUseMediaQuery } from "react-responsive";
export default function ResponsiveChatLayout({
  users,
  children,
}: {
  users: { id: string; name: string; image?: string | null }[];
  children: React.ReactNode;
}) {
  const showChat = useShowChatStore((state) => state.showChat);
  const setIsMobile = useMobileStore((state) => state.setIsMobile);
  const [mobileBannerStatus, setMobileBannerStatus] = useState(false);

  const isMobile = ReactResponsiveUseMediaQuery({
    query: "(max-width: 768px)",
  });

  useEffect(() => {
    if (isMobile) {
      setIsMobile(true);
      setMobileBannerStatus(true);
    } else {
      setIsMobile(false);
      setMobileBannerStatus(false);
    }
  }, [isMobile, setIsMobile]);

  return (
    <main className="flex flex-col lg:flex-row overflow-hidden h-screen relative ">
      <AnimatePresence>
        {isMobile && mobileBannerStatus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            key={"mobile-banner"}
            className={`p-2 z-50 flex absolute w-screen h-fit bg-red-600/50
            
            backdrop-blur-lg items-center justify-center`}
          >
            <div className="self-center text-center text-xl">
              For better experience please use larger devices like laptop or
              computer
            </div>
            <div className={`mr-auto`}>
              <button
                onClick={() => setMobileBannerStatus(false)}
                className={`w-16 h-16 cursor-pointer flex justify-center items-center`}
              >
                <Plus size={40} className={`rotate-45  `} />
              </button>
            </div>
          </motion.div>
        )}
        <section
          key={"side-bar"}
          className={`overflow-y-auto relative  scrollbar-none scroll-smooth border-r-1 border-black/50
            ${showChat ? "hidden" : "block"} 
          lg:block w-full lg:w-[30%] h-full  
          `}
        >
          <div
            className={`sticky  border-b-1 border-black/50 top-0 z-40 bg-white/60 backdrop-blur-md`}
          >
            <div className=" ml-3">
              <h1 className="font-mono text-4xl font-semibold py-3">
                EchoLine{" "}
              </h1>
            </div>
            <AccessibilityCard users={users} />
          </div>
          <div>
            <UserList />
          </div>
        </section>
        <section
          key={"chat-view-screen"}
          className={`
          ${showChat ? "block" : "hidden"} 
          lg:block overflow-hidden w-full lg:w-[70%] h-full
          `}
        >
          {children}
        </section>
      </AnimatePresence>
    </main>
  );
}
