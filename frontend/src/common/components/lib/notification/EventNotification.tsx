import { useEffect } from 'react';
import Pusher from 'pusher-js';

import { useSnackbar } from 'notistack';

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  forceTLS: true,
});

const EventNotifications = () => {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const channel = pusher.subscribe('meets');

    channel.bind('EventRegistered', (data: any) => {
      console.log('New registration for event', data);
      enqueueSnackbar(`${data?.message}!`, {
        variant: 'success',
      });
    });

    return () => {
      pusher.unsubscribe('events');
    };
  }, [enqueueSnackbar]);

  return null;
};

export default EventNotifications;
