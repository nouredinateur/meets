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
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventDetailDialog from './EventDetailDialog';
import AddEventForm from './AddEventForm';
import { formatDate, formatTime } from '../defs/utils';
import { Event } from '../defs/types';

const EventsPage: NextPage = () => {
  const { t } = useTranslation(['user']);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [sortModel, setSortModel] = useState([{ field: 'createdAt', sort: 'desc' }]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);

  useEffect(() => {
    let filterParam: FilterParam | undefined;
    let sortParam: SortParam | undefined;

    readAll(page, pageSize, sortParam, filterParam ? [filterParam] : []);
  }, [page, pageSize]);

  const { items, readAll, register, paginationMeta } = useEvents();

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
          <StyledCard key={event.id} $disabled={event.remainingSpots <= 0}>
            <CardActionArea
              sx={{ height: '100%', p: 2 }}
              onClick={() => setSelectedEvent(event)}
              disabled={event.remainingSpots <= 0}
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
export default EventsPage;
