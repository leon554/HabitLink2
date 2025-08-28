
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
    skip: boolean
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
    countdata: boolean
}
export interface UserType{
    id: number
    created_at: string
    email: string
    name: string
    user_id: string
    role: string
    tokens: number
}
export interface IssueType{
    id: number
    created_at: string
    user_id: string
    page: string
    type: ErrorType
    description: string
    status: ErrorStatus
    response: string | undefined
}
export interface SubmitIssueType{
    page: string
    type: ErrorType
    description: string
}
export enum Origin{ 
    top = "top",
    bottom = "bottom",
    topRight = "top right",
    topLeft = "top left",
    bottomRight = "bottom right",
    bottomLeft = "bottom left"
}
export enum ErrorStatus{
    pending = "pending",
    reviewing = "reviewing",
    resolved = "resolved"
}
export enum ErrorType{
    dataNotLoading = "data not loading",
    layoutIssue = "layout issue",
    statisticError = "statistic is wrong",
    securityIssue = "security issue",
    other = "other"
}
export interface ChartDataType{
    date: string;
    consistency: number | null;
    strength: number | null;
}
export interface LemonSqueezyProduct {
    product: {
        type: string; 
        id: string;
        attributes: {
            store_id: number;
            name: string;
            slug: string;
            description: string;
            status: string;
            status_formatted: string;
            thumb_url: string | null;
            large_thumb_url: string | null;
            price: number;
            price_formatted: string;
            from_price: number | null;
            to_price: number | null;
            pay_what_you_want: boolean;
            buy_now_url: string;
            from_price_formatted: string | null;
            to_price_formatted: string | null;
            created_at: string; 
            updated_at: string; 
            test_mode: boolean;
        };
        relationships: {
            store: {
                links: {
                    related: string;
                    self: string;
                };
            };
            variants: {
                links: {
                    related: string;
                    self: string;
                };
            };
        };
        links: {
            self: string;
        };
    }
    variants: LemonSqueezyVariant[]
}
export interface LemonSqueezyVariant {
  id: string;
  attributes: {
    name: string;
    price: number;
    price_formatted: string;
  };
}
export interface ReturnObj<T> {
  success: boolean
  message?: string
  payload?: T
}
export interface HabitStats{
    compRate: number
    partialComps: number
    completions: number
    missedSessions: number
    strength: number
    streak: number
    entries: number
    dataSum: number
    validComps: number
    completableDays: number
    chartData: ChartDataType[]
    compsPerWeek: {completions: number, allCompletions: number, week: Date}[]
    compsPerMonth: {month: number, data: number}[]
}
export const defaultHabitStats: HabitStats = {
  compRate: 0,
  partialComps: 0,
  completions: 0,
  missedSessions: 0,
  strength: 0,
  streak: 0,
  entries: 0,
  dataSum: 0,
  validComps: 0,
  completableDays: 0,
  chartData: [], 
  compsPerWeek: [], 
  compsPerMonth: [] 
};
export interface Achievement{
    id: number
    name: string
    description: string
    userAchievements: {
        achievement_id: number
        created_at: string
    }[]
}
export enum AchievementsEnum{
    create5Habits = 1,
    have3ActiveGoals = 2,
    habitEntries100 = 3,
    habitEntries250 = 4,
    habitEntries500 = 5,
    habitEntries1000 = 6,
    habitEntries5000 = 7,
    habitEntries10000 = 8,
}
