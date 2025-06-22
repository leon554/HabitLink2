
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
      className={` w-9.5  rounded-full  flex items-center p-0.5  cursor-pointer ${props.ticked ? "bg-blue-400 " : "bg-gray-400  h-5"} duration-200 ease-in-out`}
      onClick={tick}
    >
      <div
        className={`h-4 w-4 bg-gray-700 rounded-full duration-200 ease-in-out transform ${props.ticked ? "translate-x-4.5 bg-stone-800" : "translate-x-0"}`}
      ></div>
    </div>
  );
}