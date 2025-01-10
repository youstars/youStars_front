
import React, {FC, useMemo, useState} from "react";
import {Theme,LOCALE_STORAGE_THEME_KEY,ThemeContext} from "../../lib_lib/ThemeContext";
const defaultTheme = localStorage.getItem(LOCALE_STORAGE_THEME_KEY) as Theme || Theme.LIGHT

interface Props {
    children: React.ReactNode;
}

const ThemeProvider: FC <Props>= ({children}) => {
    const [theme, setTheme] = useState<Theme>(defaultTheme)

    const defaultProps = useMemo(() => ({
        theme,
        setTheme
    }), [theme])

    return (
        <ThemeContext.Provider value={defaultProps}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
