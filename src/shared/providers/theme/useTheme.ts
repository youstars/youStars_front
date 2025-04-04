import {LOCALE_STORAGE_THEME_KEY, Theme, ThemeContext} from "./ThemeContext";
import {useContext} from "react";

export interface UseThemeResult {
    toggleTheme: () => void;
    theme: Theme;
}

export function useTheme(): UseThemeResult {
    const {theme, setTheme} = useContext(ThemeContext);
    const toggleTheme = () => {
        const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
        if (setTheme) {
            setTheme(newTheme);
        }
        localStorage.setItem(LOCALE_STORAGE_THEME_KEY, newTheme);
    }

    return <UseThemeResult>{toggleTheme, theme};

}
