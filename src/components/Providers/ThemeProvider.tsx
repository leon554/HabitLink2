
import { createContext, useState, useEffect, useLayoutEffect} from "react"

interface Theme{
    dark: boolean | null
    setDark: (dark: boolean) => void
    loading: boolean
}
const initialTheme: Theme = {
    dark: true,
    setDark: () => null,
    loading: false
}

export const themeContext = createContext<Theme>(initialTheme)

interface Props {
  children: React.ReactNode;
}
export default function ThemeProvider(props: Props) {
    const [dark, setDark] = useState<boolean| null>(null)
    const [loading, setLoading] = useState(false)

    useLayoutEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
        setDark(true);
        document.documentElement.classList.add("dark");
        } else if(savedTheme === "light"){
        setDark(false);
        document.documentElement.classList.remove("dark");
        }else{
        setDark(true)
        }
    }, []);

    useEffect(() => {
        setLoading(true)
        const timeout1 = setTimeout(() => {setLoading(false)}, 1000)
        const timeout2 = setTimeout(() => {
            if(dark === null) return
            if (dark) {
                document.documentElement.style.backgroundColor = "hsl(0, 0%, 4%)"; // Dark background hsl(0, 0%, 4%)
                document.documentElement.classList.add("dark")
                localStorage.setItem("theme", "dark");
            } else {
                document.documentElement.style.backgroundColor = "hsl(0, 0%, 100%)"; // Light background
                document.documentElement.classList.remove("dark")
                localStorage.setItem("theme", "light");
            }
        }, 500)
        return () => {
            clearTimeout(timeout1)
            clearTimeout(timeout2)
        }
    }, [dark]);

    return (
        <themeContext.Provider value={{
            dark,
            setDark,
            loading
        }}>
            
            {props.children}
        </themeContext.Provider>
    )
}
