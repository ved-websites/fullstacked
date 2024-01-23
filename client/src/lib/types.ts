import type { PageDataObject } from './utils/page-data-object';

export interface PageMessages extends PageDataObject {}

export type EventStep = 'hook' | 'action' | 'layout' | 'page' | 'resolved';
