
import { createContext, useState } from "react"
import { HabitTypeE } from "../../utils/types"

interface InputType{
  showing: boolean
  setShowing: (showing: boolean) => void
  title: string
  setTitle: (title: string) => void
  message: string
  type: HabitTypeE
  weekly: boolean
  setMessage: (message: string) => void
  alert: (message: string, type: HabitTypeE, weekly: boolean) => void
}
const initialInputValues = {
  showing: false,
  setShowing: () => null,
  title: "",
  setTitle: () => null,
  message: "",
  weekly: false,
  type: HabitTypeE.Normal,
  setMessage: () => null,
  alert: () => null
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

  function alert(message: string, type: HabitTypeE, weekly: boolean){
    setMessage(message)
    setTitle("Enter Data")
    setWeekly(weekly)
    setType(type)
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
      weekly
    }}>
          
        {props.children}
    </HabitInputContext.Provider>
  )
}
