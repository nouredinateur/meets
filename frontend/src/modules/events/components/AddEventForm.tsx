import { RHFTextField } from '@common/components/lib/react-hook-form';
import CreateCrudItemForm from '@common/components/partials/CreateCrudItemForm';
import Routes from '@common/defs/routes';
import { ItemResponse } from '@common/hooks/useItems';
import { CreateEventInput, Event, EventStatus } from '../defs/types';
import useAuth from '@modules/auth/hooks/api/useAuth';
import useEvents from '../hooks/api/useEvents';
import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
import { UseFormReturn } from 'react-hook-form';
import * as Yup from 'yup';

interface AddEventFormProps {
  onClose: () => void;
}

const AddEventForm = ({ onClose }: AddEventFormProps) => {
  const { user } = useAuth();

  const schema = Yup.object().shape({
    title: Yup.string().required('Event title is required'),
    startDate: Yup.date().required('Event date is required'),
    endDate: Yup.date().required('Event date is required'),
    location: Yup.string().required('Location is required'),
    maxParticipants: Yup.number()
      .required('Max participants is required')
      .min(1, 'Must be at least 1'),
    description: Yup.string(),
    status: Yup.string().oneOf(Object.values(EventStatus)),
  });

  const defaultValues: CreateEventInput = {
    title: '',
    date: new Date().toISOString(),
    location: '',
    maxParticipants: 1,
    description: '',
    userId: user?.id || 0,
  };

  const onPostSubmit = async (
    _data: CreateEventInput,
    response: ItemResponse<Event>,
    _methods: UseFormReturn<CreateEventInput>
  ) => {
    if (response.success) {
      onClose();
    }
  };

  return (
    <>
      <CreateCrudItemForm<Event, CreateEventInput>
        routes={Routes.Events}
        useItems={useEvents}
        schema={schema}
        defaultValues={defaultValues}
        onPostSubmit={onPostSubmit}
      >
        <Grid container spacing={3} sx={{ padding: 6 }}>
          <Grid item xs={12}>
            <RHFTextField name="title" label="Event Title" />
          </Grid>
          <Grid item xs={12}>
            <RHFTextField
              name="date"
              label="Date"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <RHFTextField name="location" label="Location" />
          </Grid>
          <Grid item xs={12}>
            <RHFTextField name="maxParticipants" label="Max Participants" type="number" />
          </Grid>
          <Grid item xs={12}>
            <RHFTextField name="description" label="Description" multiline rows={4} />
          </Grid>
        </Grid>
      </CreateCrudItemForm>
    </>
  );
};

export default AddEventForm;
