import { styled } from '@mui/material/styles';
import { Card, CardActionArea, CardContent, Typography, Box, Chip, alpha } from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  Schedule as TimeIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { IEvent } from '../defs/types';
// Styled components
const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== '$disabled',
})<{ $disabled: boolean }>(({ theme, $disabled }) => ({
  height: '100%',
  position: 'relative',
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.standard,
  }),
  ...($disabled
    ? {
        backgroundColor: theme.palette.action.disabledBackground,
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: alpha(theme.palette.background.paper, 0.12),
          zIndex: 1,
        },
      }
    : {
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }),
}));

const StyledActionArea = styled(CardActionArea)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  '&.Mui-disabled': {
    pointerEvents: 'none',
  },
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
  color: theme.palette.text.secondary,
  '& svg': {
    fontSize: '1.25rem',
    color: theme.palette.action.active,
  },
}));

const EventTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  minHeight: '56px',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  lineHeight: 1.3,
  fontWeight: 600,
}));

const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== '$soldOut',
})<{ $soldOut: boolean }>(({ theme, $soldOut }) => ({
  transition: theme.transitions.create(['background-color', 'color'], {
    duration: theme.transitions.duration.short,
  }),
  ...($soldOut
    ? {
        backgroundColor: theme.palette.error.light,
        color: theme.palette.error.contrastText,
      }
    : {
        backgroundColor: theme.palette.success.light,
        color: theme.palette.success.contrastText,
      }),
}));

interface EventCardProps {
  event: IEvent;
  setSelectedEvent: (event: IEvent) => void;
}
const EventCard = ({ event, setSelectedEvent }: EventCardProps) => {
  const isSoldOut = event.remainingSpots <= 0;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <StyledCard $disabled={isSoldOut}>
      <StyledActionArea
        onClick={() => setSelectedEvent(event)}
        disabled={isSoldOut}
        aria-disabled={isSoldOut}
      >
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <EventTitle variant="h6">{event.title}</EventTitle>

          <Box sx={{ flex: 1 }}>
            <InfoRow>
              <CalendarIcon />
              <Typography variant="body2">{formatDate(event.date)}</Typography>
            </InfoRow>

            <InfoRow>
              <TimeIcon />
              <Typography variant="body2">{formatTime(event.date)}</Typography>
            </InfoRow>

            <InfoRow sx={{ mb: 3 }}>
              <LocationIcon />
              <Typography
                variant="body2"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {event.location}
              </Typography>
            </InfoRow>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <StatusChip
              $soldOut={isSoldOut}
              label={isSoldOut ? 'Sold Out' : `${event.remainingSpots} spots left`}
              size="small"
            />

            {!isSoldOut && (
              <Typography
                variant="caption"
                sx={{
                  opacity: 0,
                  transition: (theme) => theme.transitions.create('opacity'),
                  '.MuiCardActionArea-root:hover &': {
                    opacity: 1,
                  },
                  color: 'primary.main',
                  fontWeight: 500,
                }}
              >
                View Details →
              </Typography>
            )}
          </Box>
        </CardContent>
      </StyledActionArea>
    </StyledCard>
  );
};

export default EventCard;
