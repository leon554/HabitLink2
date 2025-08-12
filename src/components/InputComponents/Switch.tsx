import { triggerHaptic } from "tactus"

interface TickeProps{
    ticked: boolean | undefined
    setStatus: (ticked: boolean) => void
}
export default function Switch(props: TickeProps) {

  function tick() {
    props.setStatus(!props.ticked)
  }

  return (
    <div
      className={` w-9.5  rounded-full  flex items-center p-0.5  cursor-pointer ${props.ticked ? "bg-blue-400 dark:bg-green-500" : "bg-panel2 dark:bg-neutral-700 h-5"} duration-200 ease-in-out`}
      onClick={() => {
        triggerHaptic()
        tick()
      }}
    >
      <div
        className={`h-4 w-4 rounded-full duration-200 ease-in-out transform ${props.ticked ? "translate-x-4.5 dark:bg-panel1 bg-subtext1" : "translate-x-0 dark:bg-subtext2 bg-subtext1"}`}
      ></div>
    </div>
  );
}