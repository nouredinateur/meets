import React from 'react';
import { Card, CardActionArea, CardContent, Typography, Box, Chip, styled } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Event } from '../defs/types';

interface EventCardProps {
  event: Event;
  setSelectedEvent: (event: Event) => void;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
}

interface StyledCardProps {
  disabled?: boolean;
}

const StyledCard = styled(Card)<StyledCardProps>(({ theme, disabled }) => ({
  height: '100%',
  transition: 'transform 0.2s',
  ...(disabled
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

const EventCard: React.FC<EventCardProps> = ({
  event,
  setSelectedEvent,
  formatDate,
  formatTime,
}) => {
  const isFull = event.remainingSpots <= 0;

  return (
    <StyledCard key={event.id} disabled={isFull}>
      <CardActionArea
        sx={{ height: '100%', p: 2 }}
        onClick={() => setSelectedEvent(event)}
        disabled={isFull}
      >
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
            <Chip label={`${event.remainingSpots} spots`} size="small" color="info" />
          </Box>
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
};

export default EventCard;
