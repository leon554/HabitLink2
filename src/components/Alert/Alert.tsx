import { motion, AnimatePresence } from "motion/react";
import { useContext } from "react";
import { AlertContext } from "./AlertProvider";

export default function Alert() {
  const AlertData = useContext(AlertContext);
  return (
    <>
      <div className={`bg-black w-full h-full absolute top-0 z-49 ${AlertData.showing ? "opacity-65" : "opacity-0"}`} style={{
        display: AlertData.showing ? "" : "none"
      }}></div>
      <AnimatePresence>
        {AlertData.showing == true && (
          <motion.div
            initial={{ y: -200 }}
            animate={{ y: 0 }}
            exit={{ y: -200 }}
            transition={{ duration: 0.5 }}
            className=" flex flex-col items-center gap-2 z-50 absolute top-1 left-1/2 transform -translate-x-1/2 p-4 bg-stone-800  rounded-md max-w-100 w-[80%]">
            <h1 className="text-lg font-semibold text-stone-200 font-mono">{AlertData.title}</h1>
            <h1 className="text-md text-stone-400 text-center font-mono">
              {AlertData.message}
            </h1>
            <div className="flex justify-center  w-full">
              <button
                className="mt-2 bg-green-400 text-stone-800 font-mono p-1 rounded-md pl-2 pr-2 hover:cursor-pointer w-full"
                onClick={() => {
                  AlertData.setShowing(false);
                  console.log(AlertData.showing);
                }}>
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
