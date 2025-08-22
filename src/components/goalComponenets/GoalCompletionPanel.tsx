import DeleteArchiveGoal from "./DeleteArchiveGoal"

export default function GoalCompletionPanel() {
    return (
        <div className="shadow-md shadow-gray-200 dark:shadow-none bg-panel1 w-[90%] max-w-[600px] rounded-2xl p-7 flex flex-col  gap-3 justify-center  text-title drop-shadow-md outline-1 outline-border">
            <p className="text-lg font-medium">
                Goal Completed 🎉 
            </p>
            <p className="text-subtext1 mb-2 text-sm">
                Congratulations! You've completed your goal — amazing work and well done! 💪
            </p>
            <DeleteArchiveGoal/>
        </div>
    )
}
