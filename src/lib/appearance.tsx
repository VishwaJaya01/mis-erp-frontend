import { ThemeProvider, useTheme } from 'next-themes';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';
export type DensityMode = 'cozy' | 'compact';

type DensityContextValue = {
  density: DensityMode;
  setDensity: (value: DensityMode) => void;
};

const DensityContext = createContext<DensityContextValue | undefined>(
  undefined
);

const SETTINGS_STORAGE_KEY = 'appSettings';

function readDensityFromStorage(): DensityMode {
  if (typeof window === 'undefined') {
    return 'cozy';
  }

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return 'cozy';
    }

    const settings = JSON.parse(raw) as {
      general?: { density?: DensityMode };
    };
    return settings?.general?.density === 'compact' ? 'compact' : 'cozy';
  } catch (error) {
    console.error('Failed to read density preference', error);
    return 'cozy';
  }
}

function DensityProvider({ children }: { children: ReactNode }) {
  const [density, setDensityState] = useState<DensityMode>(() =>
    readDensityFromStorage()
  );

  const applyDensity = useCallback((value: DensityMode) => {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    root.setAttribute('data-density', value);

    const fontSize = value === 'compact' ? '15px' : '16px';
    const radius = value === 'compact' ? '0.55rem' : '0.625rem';
    const spacing = value === 'compact' ? '0.22rem' : '0.25rem';
    const contentPadding = value === 'compact' ? '1.25rem' : '1.5rem';

    root.style.setProperty('--font-size', fontSize);
    root.style.setProperty('--radius', radius);
    root.style.setProperty('--spacing', spacing);
    root.style.setProperty('--content-padding', contentPadding);
  }, []);

  const updateDensity = useCallback(
    (value: DensityMode) => {
      setDensityState(value);
      applyDensity(value);
    },
    [applyDensity]
  );

  useEffect(() => {
    // Apply preference on mount
    applyDensity(density);
  }, [applyDensity, density]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
      const settings = raw ? JSON.parse(raw) : {};
      const general = settings.general ? { ...settings.general } : {};

      if (general.density === density) {
        return;
      }

      general.density = density;
      const updated = { ...settings, general };
      window.localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error('Failed to persist density preference', error);
    }
  }, [density]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== SETTINGS_STORAGE_KEY) {
        return;
      }

      try {
        const nextDensity = readDensityFromStorage();
        setDensityState((current) => {
          if (current === nextDensity) {
            return current;
          }
          applyDensity(nextDensity);
          return nextDensity;
        });
      } catch (error) {
        console.error('Failed to sync density from storage', error);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [applyDensity]);

  return (
    <DensityContext.Provider value={{ density, setDensity: updateDensity }}>
      {children}
    </DensityContext.Provider>
  );
}

export function useDensity(): DensityContextValue {
  const context = useContext(DensityContext);
  if (!context) {
    throw new Error('useDensity must be used within an AppearanceProvider');
  }
  return context;
}

function ThemeBootstrap() {
  const { setTheme, theme } = useTheme();
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) {
      return;
    }

    bootstrapped.current = true;

    if (typeof window === 'undefined') {
      return;
    }

    try {
      const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!raw) {
        return;
      }

      const settings = JSON.parse(raw) as {
        general?: { theme?: ThemePreference };
      };

      const storedTheme = settings?.general?.theme;
      if (storedTheme && storedTheme !== theme) {
        setTheme(storedTheme);
      }
    } catch (error) {
      console.error('Failed to bootstrap theme preference', error);
    }
  }, [setTheme, theme]);

  return null;
}

function ThemeStorageSync() {
  const { theme } = useTheme();

  useEffect(() => {
    if (typeof window === 'undefined' || !theme) {
      return;
    }

    try {
      const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
      const settings = raw ? JSON.parse(raw) : {};
      const general = settings.general ? { ...settings.general } : {};

      if (general.theme === theme) {
        return;
      }

      general.theme = theme as ThemePreference;
      const updated = { ...settings, general };
      window.localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error('Failed to persist theme preference', error);
    }
  }, [theme]);

  return null;
}

function ThemeColorSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (typeof document === 'undefined' || !resolvedTheme) {
      return;
    }

    const meta = document.querySelector<HTMLMetaElement>(
      "meta[name='theme-color']"
    );
    if (!meta) {
      return;
    }

    const rootStyles = getComputedStyle(document.documentElement);
    const background = rootStyles.getPropertyValue('--background').trim();
    const safeColor =
      background && CSS.supports('color', background)
        ? background
        : resolvedTheme === 'dark'
        ? '#0c130e'
        : '#ffffff';

    meta.setAttribute('content', safeColor);
  }, [resolvedTheme]);

  return null;
}

export function AppearanceProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="mis-erp-theme"
    >
      <DensityProvider>
        <ThemeBootstrap />
        <ThemeStorageSync />
        <ThemeColorSync />
        {children}
      </DensityProvider>
    </ThemeProvider>
  );
}

export function useAppearanceTheme() {
  return useTheme();
}
