
'use client';

import { useEffect, useState } from 'react';

const themeColors = [
  { name: 'Verde', primary: '142.1 76.2% 36.3%' },
  { name: 'Padrão (Azul)', primary: '221.2 83.2% 53.3%' },
  { name: 'Roxo', primary: '262.1 83.3% 57.8%' },
  { name: 'Laranja', primary: '24.6 95% 53.1%' },
  { name: 'Cinza', primary: '215.3 19.3% 34.5%' },
];

const applyTheme = (primaryHsl: string) => {
    document.documentElement.style.setProperty('--primary', primaryHsl);
    document.documentElement.style.setProperty('--ring', primaryHsl);
};


export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const savedColorName = localStorage.getItem('themeColorName');
      const colorToApply = themeColors.find(c => c.name === savedColorName) || themeColors[0];
      applyTheme(colorToApply.primary);
    }
  }, [isMounted]);

  if (!isMounted) {
      return null;
  }

  return <>{children}</>;
}
