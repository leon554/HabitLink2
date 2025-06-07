
export enum SignUpResponses{
    SignUpError,
    UserExists,
    EmailSent
}
export interface HabitType{
    id: string
    user_id: string
    name: string
    description: string
    completionDays: string
    icon: string
    type: string
    target: string,
    creationDate: string
}
export interface HabitCompletionType{
    id: string
    created_at: string
    habitId: string
    data: number
    date: number
    user_id: string
}
export enum HabitTypeE{
    Normal = "Normal",
    Time_Based = "Time Based",
    Distance_Based = "Distance Based",
    Iteration_Based = "Iteration Based"
}