import About from './pages/About';
import Challenges from './pages/Challenges';
import Dashboard from './pages/Dashboard';
import Demo from './pages/Demo';
import Disclaimer from './pages/Disclaimer';
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

import type { ComponentType } from 'react';

export const PAGES: Record<string, ComponentType> = {
    "About": About,
    "Challenges": Challenges,
    "Dashboard": Dashboard,
    "Demo": Demo,
    "Disclaimer": Disclaimer,
    "Home": Home,
    "Privacy": Privacy,
    "Terms": Terms,
}

export const pagesConfig: {
  mainPage: string;
  Pages: Record<string, ComponentType>;
  Layout?: ComponentType<{ currentPageName: string; children: React.ReactNode }>;
} = {
    mainPage: "Home",
    Pages: PAGES,
};
