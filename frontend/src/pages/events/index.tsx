import * as React from 'react';
import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { FilterParam, SortParam, UseItems, UseItemsOptions } from '@common/hooks/useItems';
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Pagination,
} from '@mui/material';
import {
  CalendarMonth as CalendarMonthIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Routes from '@common/defs/routes';
import ApiRoutes from '@common/defs/api-routes';
import useEvents from '@modules/events/hooks/api/useEvents'; // Ensure this import is correct
import useAuth from '@modules/auth/hooks/api/useAuth'; // Import the useAuth hook
import { useForm } from 'react-hook-form';

// Type definitions
interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  maxParticipants: number;
  description?: string;
}

interface CreateEventInput {
  title: string;
  date: string;
  location: string;
  maxParticipants: number;
  description?: string;
  userId: string; // Add userId to the input type
}

interface PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  lastPage: number;
}

// Utility functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const AddEventForm = ({ onClose }: { onClose: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateEventInput>({
    defaultValues: {
      title: '',
      date: '',
      location: '',
      maxParticipants: 0,
      description: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const { createOne } = useEvents();

  const onSubmit = async (data: CreateEventInput) => {
    setLoading(true);
    setError(null);
    try {
      await createOne({ ...data, userId: user?.id });
      onClose();
      reset();
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2}>
        <TextField
          label="Event Title"
          {...register('title', { required: 'Event title is required' })}
          error={!!errors.title}
          helperText={errors.title?.message}
          fullWidth
        />

        <TextField
          label="Event Date"
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
          {...register('date', { required: 'Event date is required' })}
          error={!!errors.date}
          helperText={errors.date?.message}
          fullWidth
        />

        <TextField
          label="Location"
          {...register('location', { required: 'Location is required' })}
          error={!!errors.location}
          helperText={errors.location?.message}
          fullWidth
        />

        <TextField
          label="Max Participants"
          type="number"
          {...register('maxParticipants', {
            required: 'Max participants is required',
            min: { value: 1, message: 'Must be at least 1' },
            valueAsNumber: true,
          })}
          error={!!errors.maxParticipants}
          helperText={errors.maxParticipants?.message}
          fullWidth
        />

        <TextField label="Description" {...register('description')} multiline rows={4} fullWidth />

        {error && <Typography color="error">{error}</Typography>}

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Creating...' : 'Create Event'}
        </Button>
      </Stack>
    </form>
  );
};

const EventDetailDialog = ({
  event,
  open,
  onClose,
}: {
  event: Event;
  open: boolean;
  onClose: () => void;
}) => {
  const { register } = useEvents();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    const response = await register(event.id);
    setLoading(false);

    if (response.success) {
      alert('Successfully registered for the event!');
      onClose();
    } else {
      alert(`Registration failed: ${response.message || 'Unknown error'}`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{event.title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonthIcon color="action" />
            <Typography>{formatDate(event.date)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScheduleIcon color="action" />
            <Typography>{formatTime(event.date)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon color="action" />
            <Typography>{event.location}</Typography>
          </Box>
          <Typography variant="body1">{event.description}</Typography>
          <Chip label={`${event.maxParticipants} spots available`} color="info" />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" color="primary" onClick={handleRegister} disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Events Page Component
const EventsPage: NextPage = () => {
  const { t } = useTranslation(['user']);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [sortModel, setSortModel] = useState([{ field: 'createdAt', sort: 'desc' }]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  useEffect(() => {
    let filterParam: FilterParam | undefined;
    let sortParam: SortParam | undefined;

    readAll(page, pageSize, sortParam, filterParam ? [filterParam] : []);
  }, [page, pageSize]);
  const { items, readAll, register, paginationMeta } = useEvents();

  console.log(items);
  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => setShowAddForm(true)} sx={{ mb: 2 }}>
        Add New Event
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
        {items?.map((event) => (
          <Card
            key={event.id}
            sx={{
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' },
            }}
          >
            <CardActionArea sx={{ height: '100%', p: 2 }} onClick={() => setSelectedEvent(event)}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {event.title}
                </Typography>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonthIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(event.date)}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {formatTime(event.date)}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {event.location}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                  <Chip label={`${event.maxParticipants} spots`} size="small" color="info" />
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
      {paginationMeta && paginationMeta.lastPage > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
          <Pagination
            count={paginationMeta.lastPage} // Total pages
            page={page} // Controlled page state
            onChange={(_, newPage) => setPage(newPage)} // Correctly updates `page`
            color="primary"
            variant="outlined"
            shape="rounded"
          />
        </Box>
      )}{' '}
    </Box>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['topbar', 'footer', 'leftbar', 'user', 'common'])),
  },
});

export default withAuth(EventsPage, {
  mode: AUTH_MODE.LOGGED_IN,
  redirectUrl: Routes.Auth.Login,
});
