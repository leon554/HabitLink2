import { useContext } from "react";
import Switch from "./InputComponents/Switch";
import { SettingsContext } from "./Providers/SettingsProvider";


export default function SettingsToggles() {

    const {settings, setSettings} = useContext(SettingsContext)

    return (
        <div className="shadow-md shadow-gray-200 dark:shadow-none w-[90%] max-w-[600px] bg-panel1 outline-1 outline-border rounded-2xl p-7 py-4 pb-6 flex flex-col gap-3">
            <p className="text-lg text-title font-medium">
                Settings
            </p>
            <div className="flex justify-between items-center gap-4">
                <p className="text-xs text-subtext2">
                    Count unscheduled completions in completions per week/month graphs
                </p>
                <div>
                    <Switch ticked={settings.countUnscheduledCompletions} setStatus={(t) => setSettings({...settings, countUnscheduledCompletions: t})}/>
                </div>
            </div>
            <hr className="text-border2"/>
             <div className="flex justify-between items-center gap-4">
                <p className="text-xs text-subtext2">
                    Don't show red for habits that can be logged today on the log page
                </p>
                <div>
                    <Switch ticked={settings.dontShowRed} setStatus={(t) => setSettings({...settings, dontShowRed: t})}/>
                </div>
            </div>
        </div>
    )
}
