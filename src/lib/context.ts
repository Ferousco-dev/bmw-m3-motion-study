import { createContext } from 'react';
import type { TimelineStore } from './store';

export const TimelineContext = createContext<TimelineStore | null>(null);
