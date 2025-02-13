import useEvents from '@modules/events/hooks/api/useEvents';
import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { FilterParam, SortParam } from '@common/hooks/useItems';
import {
  Box,
  CardContent,
  CardActionArea,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Pagination,
  styled,
  Card,
  Skeleton,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventDetailDialog from './EventDetailDialog';
import AddEventForm from './AddEventForm';
import { formatDate, formatTime } from '../defs/utils';
import { Event } from '../defs/types';
import EventCard from './EventCard';

const EventsPage: NextPage = () => {
  const { t } = useTranslation(['user']);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);

  // Fetch events with pagination
  const { items, readAll, paginationMeta, isLoading } = useEvents();

  useEffect(() => {
    readAll(page, pageSize);
  }, [page, pageSize]);

  const StyledCard = styled(Card)<{ $disabled: boolean }>(({ theme, $disabled }) => ({
    height: '100%',
    transition: 'transform 0.2s',
    ...($disabled
      ? {
          backgroundColor: theme.palette.action.disabledBackground,
          opacity: 0.6,
          cursor: 'not-allowed',
          pointerEvents: 'none',
        }
      : {
          '&:hover': { transform: 'translateY(-4px)' },
        }),
  }));
  const handleSelectEvent = (event: Event) => {
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
          onEventUpdate={(updatedEvent) => {
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
