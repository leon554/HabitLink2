import DeleteArchiveGoal from "./DeleteArchiveGoal"

export default function GoalCompletionPanel() {
    return (
        <div className="bg-panel1 w-[90%] max-w-[600px] rounded-2xl p-5 flex flex-col  gap-5 justify-center  text-title drop-shadow-md outline-1 outline-border">
            <p className="text-center">
                🎉 Congratulations! You've completed your goal — amazing work and well done! 💪
            </p>
            <DeleteArchiveGoal/>
        </div>
    )
}
