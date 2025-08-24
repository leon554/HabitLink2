
import { createContext, useState, useEffect} from "react"

interface Settings{
    showDetails: boolean
    showNormal: boolean
    showDue: boolean
    showRanks: boolean
    countUnscheduledCompletions: boolean
    dontShowRed: boolean
    dontShowStreaks: boolean
}
const initialSettings: Settings = {
    showDetails: true,
    showNormal: false,
    showDue: false,
    showRanks: false,
    countUnscheduledCompletions: false,
    dontShowRed: false,
    dontShowStreaks: false
}
interface SettingsType{
  settings: Settings 
  setSettings: (settings: Settings) => void
}
const initialSettingsValues: SettingsType = {
    settings: initialSettings,
    setSettings: () => null
}

export const SettingsContext = createContext<SettingsType>(initialSettingsValues)

interface Props {
  children: React.ReactNode;
}
export default function SettingsProvider(props: Props) {
    const [settings, setSettings] = useState<Settings>(initialSettings)

    useEffect(() => {
        const fetchedSettings = localStorage.getItem("settings")
        if(!fetchedSettings){
            localStorage.setItem("settings", JSON.stringify(settings))
            return
        }
        setSettings(JSON.parse(fetchedSettings))
    }, [])

    useEffect(() => {
        const id = setTimeout(() => localStorage.setItem("settings", JSON.stringify(settings)),200)
        return () => clearTimeout(id)
    }, [settings])

    return (
        <SettingsContext.Provider value={{
            setSettings,
            settings
        }}>
            
            {props.children}
        </SettingsContext.Provider>
    )
}
