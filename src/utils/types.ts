
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