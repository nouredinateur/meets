import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Routes from '@common/defs/routes';
import ApiRoutes from '@common/defs/api-routes';
import useEvents from '@modules/events/hooks/api/useEvents'; // Ensure this import is correct
import useAuth from '@modules/auth/hooks/api/useAuth'; // Import the useAuth hook
import { useForm } from 'react-hook-form';

import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { FilterParam, SortParam, UseItems, UseItemsOptions } from '@common/hooks/useItems';
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
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { formatDate, formatTime } from '../defs/utils';
import { Event } from '../defs/types';

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
          <Chip label={`${event.remainingSpots} spots available`} color="info" />
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

export default EventDetailDialog;
