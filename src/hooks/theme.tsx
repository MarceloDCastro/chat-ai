import { useEffect, useState } from "react";

type Theme = 'light' | 'dark';

export default function useTheme() {
    const [theme, setTheme] = useState<Theme>('light');

    function updateThemeFromLocalStorage() {
        if (localStorage.theme === 'dark') {
            setTheme('dark');
          } else {
            setTheme('light');
          }
    }

    function handleThemeInLocalStorage(theme: Theme){
        switch(theme) {
            case 'light':
                return localStorage.theme = 'light';
            case 'dark':
                return localStorage.theme = 'dark';
            default:
                return localStorage.removeItem('theme');
        }
    }

    function toggleTheme() {
        const newTheme = theme === 'light' ? 'dark' : 'light';

        setTheme(newTheme);
        handleThemeInLocalStorage(newTheme);
    }

    function handleAppTheme(theme: Theme) {
        if(theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    useEffect(updateThemeFromLocalStorage, []);

    useEffect(() => {
        handleAppTheme(theme);
    }, [theme]);

    return { theme, setTheme, toggleTheme };
}