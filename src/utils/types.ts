
export enum SignUpResponses{
    SignUpError,
    UserExists,
    EmailSent
}
export interface HabitType{
    id: number
    user_id: string
    name: string
    description: string
    completionDays: string
    icon: string
    type: string
    target: number,
    creationDate: number
}
export interface HabitCompletionType{
    id: number
    created_at: string
    habitId: number
    data: number
    date: number
    user_id: string
}
export interface GaolCompletionType{
    id: number
    created_at: string
    goalId: number
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
export interface GoalType{
    id: number
    created_at: string
    name: string,
    description?: string
    type: string
    startValue: number
    targetValue: number
    user_id: string
    habits: string
    completionDate: number
    linkedHabit: number | null
    archived: boolean
    completed: boolean
}
export interface UserType{
    id: number
    created_at: string
    email: string
    name: string
    user_id: string
    role: string
}
export enum Origin{ 
    top = "top",
    bottom = "bottom",
    topRight = "top right",
    topLeft = "top left",
    bottomRight = "bottom right",
    bottomLeft = "bottom left"
}