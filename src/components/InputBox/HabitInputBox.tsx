
import { motion, AnimatePresence } from "motion/react";
import { useContext, useEffect, useState } from "react";
import { HabitInputContext } from "./HabitInputProvider";
import { HabitTypeE } from "../../utils/types";
import TimeInput from "../InputComponents/TimeInput";
import AmountInput from "../InputComponents/NumberInput";
import DistanceInput from "../InputComponents/DistanceInput";
import { UserContext } from "../Providers/UserProvider";
import { AiOutlineLoading } from "react-icons/ai";
import { AlertContext } from "../Alert/AlertProvider";


export default function HabitInputBox() {
  const inputData = useContext(HabitInputContext);
  const {alert} = useContext(AlertContext)
  const {loading} = useContext(UserContext)
  const [value, setValue] = useState(0)
  
  useEffect(() => {
    setValue(0)
  }, [inputData.showing])
  return (
    <>
      <div className={`bg-black w-full h-full fixed  top-0 z-49 ${inputData.showing ? "opacity-65" : "opacity-0"}`} style={{
        display: inputData.showing ? "" : "none"
      }}
      onClick={() => inputData.setShowing(false)}>

      </div>
      <AnimatePresence>
        {inputData.showing == true && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className=" flex fixed flex-col items-center gap-2 z-50 top-1/4 left-1/2 transform -translate-x-1/2 p-4 bg-stone-800  rounded-md max-w-100 w-[80%]">
            <h1 className="text-lg font-semibold text-stone-200 font-mono">{inputData.title}</h1>
            <h1 className="text-md text-stone-400 text-center font-mono">
              {inputData.message}
            </h1>
            <div className=" w-full">
                {inputData.type == HabitTypeE.Time_Based ? 
                    <TimeInput setDuration={setValue} /> 
                : 
                inputData.type == HabitTypeE.Distance_Based ? 
                    <DistanceInput distance={value} setDistance={setValue} max={inputData.max}/>
                :
                    <AmountInput amount={value} setAmount={setValue} max={inputData.max}/> 
                }
            </div>
            <div className="flex justify-stretch  w-full gap-3">
              <button
                className="mt-2 grow-4 bg-green-400 text-stone-800 font-mono p-1 rounded-md pl-2 pr-2 hover:cursor-pointer flex justify-center items-center"
                onClick={async () => {
                  if(!inputData.callbackRef.current) return
                  await inputData.callbackRef.current(value);
                  alert("Succes, Well Done! 🎉🎉🎉")
                  inputData.setShowing(false);
                }}>
                {loading ? <AiOutlineLoading className="animate-spin" /> : "Submit"}
              </button>
              <button
                className="mt-2 grow-1 bg-green-400 text-stone-800 font-mono p-1 rounded-md pl-2 pr-2 hover:cursor-pointer"
                onClick={() => {
                  inputData.setShowing(false)
                }}>
                Exit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
