import { motion } from "framer-motion";

export default function SettingsPage({}) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overflow-hidden h-screen origin-left absolute left-0 top-full  w-full  bg-white shadow-lg border z-10"
    ></motion.div>
  );
}
