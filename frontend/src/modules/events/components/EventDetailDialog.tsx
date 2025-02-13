import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Alert,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { formatDate, formatTime } from '../defs/utils';
import { IEvent } from '../defs/types';
import useEvents from '@modules/events/hooks/api/useEvents';

interface EventDetailDialogProps {
  event: IEvent;
  open: boolean;
  onClose: () => void;
  onEventUpdate: (updatedEvent: IEvent) => void;
}

const EventDetailDialog = ({ event, open, onClose, onEventUpdate }: EventDetailDialogProps) => {
  const { register: registerForEvent } = useEvents();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { handleSubmit, reset } = useForm();

  const onSubmit = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await registerForEvent(event.id);
      if (response.success) {
        const updatedEvent = {
          ...event,
          remainingSpots: event.remainingSpots - 1,
        };
        onEventUpdate(updatedEvent);
        reset();
        onClose();
      } else {
        setApiError(response.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
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
          <Chip label={`${event.remainingSpots} spots available`} color="info" />

          {apiError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {apiError}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmit)}
          disabled={loading || event.remainingSpots <= 0}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailDialog;
