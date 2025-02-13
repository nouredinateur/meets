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
import EventsPage from '@modules/events/components/EventsPage';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['topbar', 'footer', 'leftbar', 'user', 'common'])),
  },
});

export default withAuth(EventsPage, {
  mode: AUTH_MODE.LOGGED_IN,
  redirectUrl: Routes.Auth.Login,
});
