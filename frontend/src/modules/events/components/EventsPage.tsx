import useEvents from '@modules/events/hooks/api/useEvents';
import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Pagination,
  Skeleton,
} from '@mui/material';
import EventDetailDialog from './EventDetailDialog';
import AddEventForm from './AddEventForm';
import EventCard from './EventCard';
import { IEvent } from '../defs/types';

const EventsPage: NextPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [page, setPage] = useState<number>(1);
  const pageSize = 6;

  // Fetch events with pagination
  const { items, readAll, paginationMeta, isLoading } = useEvents();

  useEffect(() => {
    readAll(page, pageSize);
  }, [page, pageSize]);

  const handleSelectEvent = (event: IEvent) => {
    setSelectedEvent(event);
  };
  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => setShowAddForm(true)} sx={{ mb: 4 }}>
        Post an Event
      </Button>
      <Dialog open={showAddForm} onClose={() => setShowAddForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <AddEventForm onClose={() => setShowAddForm(false)} />
        </DialogContent>
      </Dialog>
      {selectedEvent && (
        <EventDetailDialog
          event={selectedEvent}
          open={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEventUpdate={() => {
            readAll(page, pageSize);
          }}
        />
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 3,
          mb: 4,
        }}
      >
        {isLoading ? (
          <Skeleton variant="rounded" width={600} height={1000} />
        ) : (
          items?.map((event) => (
            <EventCard
              event={{
                id: event.id,
                title: event.title,
                date: event.date,
                location: event.location,
                description: event.description,
                remainingSpots: event.remainingSpots,
              }}
              setSelectedEvent={handleSelectEvent}
            />
          ))
        )}
      </Box>

      {/* Pagination */}
      {paginationMeta && paginationMeta.lastPage > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={paginationMeta.lastPage}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default EventsPage;
