import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LandingPage from '@common/components/pages/LandingPage';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['topbar', 'footer', 'leftbar', 'home'])),
  },
});

export default LandingPage;
