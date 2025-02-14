import { CrudObject, Id } from '@common/defs/types';

export interface EventStatusOptions {
  open: string;
  full: string;
}

export enum EventStatus {
  OPEN = 'OPEN',
  FULL = 'FULL',
  CANCELLED = 'CANCELLED',
}

export interface Event extends CrudObject {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
}

export interface CreateEventInput {
  title: string;
  date: string;
  location: string;
  maxParticipants: number;
  description: string;
  user_id: number;
}

export interface CreateOneInput {
  title: string;
  description: string;
  date: string;
  location: string;
  user_id: Id;
}

export interface UpdateOneInput {
  title: string;
  description: string;
  date: string;
  location: string;
  userId: Id;
}

export interface PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  lastPage: number;
}

export interface IEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  remainingSpots: number;
}
