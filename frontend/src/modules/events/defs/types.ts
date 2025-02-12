import { CrudObject, Id } from '@common/defs/types';

export interface Event extends CrudObject {
  title: string;
  date: string;
  location: string;
  max_participants: number;
  userId: Id;
}

export interface EventStatusOptions {
  open: string;
  full: string;
}

export enum EventStatus {
  OPEN = 'OPEN',
  FULL = 'FULL',
  CANCELLED = 'CANCELLED',
}

export interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string | Date;
  endDate: string | Date;
  status: EventStatus;
  location: string;
}
