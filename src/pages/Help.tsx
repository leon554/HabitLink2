

export default function Help() {
    return (
        <div className="mt-18 text-title flex flex-col items-center gap-5 mb-10">
            <div className="bg-panel1 w-[90%] max-w-[500px] rounded-xl p-7 py-5 outline-1 outline-border flex flex-col gap-4">
                <p className="text-lg font-medium text-title">
                    Creating Your First Goal 🎯
                </p>
                <div>
                    <ol className="list-decimal list-inside space-y-2 mb-4">
                        <li className="text-subtext2 text-sm">
                        Start by creating some habits—these can include any of your daily routines.
                        </li>
                        <li className="text-subtext2 text-sm">
                        To create a goal, go to the "Create Goal" page and enter a name for your goal.
                        </li>
                        <li className="text-subtext2 text-sm">
                        Goals work by associating and optionally linking habits. These habits are used to calculate statistics and track your progress.
                        </li>
                        <li className="text-subtext2 text-sm">
                        You can associate as many habits as you like with a goal. These associated habits are used to calculate statistics such as strength and consistency. Typically, you’ll associate habits that contribute to your goal in some way. For example, for the goal “Lose 10kg,” you might associate habits like “Go to the gym” or “Skip lunch.”
                        </li>
                        <li className="text-subtext2 text-sm">
                        A linked habit is used specifically to measure progress towards your goal. For example, for the goal “Walk 2000km,” you could link the habit “Go for a walk.” Each time you log this habit, your goal’s progress will update automatically. Note: You can only link one habit per goal, and linking a habit is optional.
                        </li>
                    </ol>
                </div>
            </div>
            <div className="bg-panel1 w-[90%] max-w-[500px] rounded-xl p-7 py-5 outline-1 outline-border flex flex-col gap-4">
                <p className="text-lg font-medium text-title">
                    How To Generate Recommended Habits For A Goal 🤖
                </p>
                
                <p className="text-subtext2 text-sm">
                    Start by entering a name for your goal, then click the 'Associate Habits' button. Next, click 'Generate Habits' to see a list of recommended habits. From there, choose the ones you want and click on each to complete their details.
                </p>
            
             
            </div>
            <div className="bg-panel1 w-[90%] max-w-[500px] rounded-xl p-7 py-5 outline-1 outline-border flex flex-col gap-4">
                <p className="text-lg font-medium text-title">
                    What Exactly Is Consistency 📈
                </p>
                
                <p className="text-subtext2 text-sm">
                    Consistency shows how often you stick to your habit. It’s the number of days you completed it divided by the number of days it was scheduled. 
                </p>
            
                <p className="text-subtext2 text-sm">
                    NOTE: completions on days which was not scheduled will not count towards your consistency.
                </p>
             
            </div>
            <div className="bg-panel1 w-[90%] max-w-[500px] rounded-xl p-7 py-5 outline-1 outline-border flex flex-col gap-4">
                <p className="text-lg font-medium text-title">
                    What Exactly Is Strength 💪
                </p>
                
                <p className="text-subtext2 text-sm">
                    Strength shows how solid your habit is. It's based on how many of the last 30 scheduled days you completed it. It starts at 0 and increases as you stick with the habit consistently.
                </p>
            
                <p className="text-subtext2 text-sm">
                    NOTE: completions on days which was not scheduled will not count towards your strength.
                </p>
             
            </div>
        </div>
    )
}
