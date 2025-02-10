import { forwardRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, BoxProps } from '@mui/material';
import Image from 'next/image';

interface LogoProps extends BoxProps {
  id: string;
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ id, disabledLink = false, sx, ...other }, ref) => {
    const theme = useTheme();
    const PRIMARY_MAIN = theme.palette.primary.main;

    const logo = (
      <Box
        ref={ref}
        component="div"
        sx={{
          display: 'inline-flex',
          ...sx,
        }}
        {...other}
      >
        <Image src="/meets.png" alt="Logo" width={80} height={80} />
      </Box>
    );

    if (disabledLink) {
      return <>{logo}</>;
    }

    return <>{logo}</>;
  }
);

export default Logo;
