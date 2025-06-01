
import { createContext, useState, useRef} from "react"
import { HabitTypeE } from "../../utils/types"

interface InputType{
  showing: boolean
  setShowing: (showing: boolean) => void
  title: string
  setTitle: (title: string) => void
  message: string
  type: HabitTypeE
  weekly: boolean
  max: number | undefined
  setMessage: (message: string) => void
  alert: (message: string, type: HabitTypeE, weekly: boolean, max: number) => void
  callbackRef: React.RefObject<((value: number) => Promise<void>) | null>
}
const initialInputValues: InputType = {
  showing: false,
  setShowing: () => null,
  title: "",
  setTitle: () => null,
  message: "",
  weekly: false,
  max: undefined,
  type: HabitTypeE.Normal,
  setMessage: () => null,
  alert: () => null,
  callbackRef: { current: null }
}

export const HabitInputContext = createContext<InputType>(initialInputValues)

interface Props {
  children: React.ReactNode;
}
export default function HabitInputProvider(props: Props) {
  const [showing, setShowing] = useState(false)
  const [message, setMessage] = useState("")
  const [title, setTitle] = useState("")
  const [weekly, setWeekly] = useState(false)
  const [type, setType] = useState(HabitTypeE.Normal)
  const [max, setMax] = useState<number| undefined>(undefined)
  const callbackRef = useRef<(value: number) => Promise<void>>(null);

  async function alert(message: string, type: HabitTypeE, weekly: boolean, max: number){
    setMessage(message)
    setTitle("Enter Data")
    setWeekly(weekly)
    setType(type)
    setMax(max)
    setShowing(true)
  }
  return (
    <HabitInputContext.Provider value={{
      showing: showing,
      setShowing: setShowing,
      message: message,
      setMessage: setMessage,
      title: title,
      setTitle: setTitle,
      alert: alert,
      type,
      weekly,
      callbackRef,
      max
    }}>
          
        {props.children}
    </HabitInputContext.Provider>
  )
}
