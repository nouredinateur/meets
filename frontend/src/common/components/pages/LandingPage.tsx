'use client';
import { Container, Typography, Button, TextField, Box, Rating } from '@mui/material';
import { styled } from '@mui/system';
import Image from 'next/image';

const HeroSection = styled('div')({
  padding: '80px 0',
  position: 'relative',
  overflow: 'hidden',
});

const UnderlinedText = styled('span')({
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    left: 0,
    width: '100%',
    height: '3px',
    background: '#000',
  },
});

const StatsContainer = styled(Box)({
  display: 'flex',
  gap: '48px',
  marginTop: '48px',
});

const StatBox = styled(Box)({
  '& .MuiTypography-h3': {
    fontWeight: 700,
    marginBottom: '8px',
  },
  '& .MuiTypography-body1': {
    color: '#666',
  },
});

const EmailInput = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '30px',
    backgroundColor: '#fff',
    '& fieldset': {
      borderColor: '#e0e0e0',
    },
  },
  width: '300px',
});

export default function LandingPage() {
  return (
    <>
      <HeroSection>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '64px' }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '40px', md: '64px' },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  marginBottom: '24px',
                }}
              >
                Connect with <UnderlinedText>people</UnderlinedText> who share your interests
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: '#666',
                  marginBottom: '32px',
                  fontSize: { xs: '18px', md: '20px' },
                  lineHeight: 1.5,
                }}
              >
                Fast, user-friendly and engaging - discover local meetups and events, connect with
                like-minded individuals, and create memorable experiences through our
                community-driven platform.
              </Typography>

              <StatsContainer>
                <StatBox>
                  <Typography variant="h3">50k+</Typography>
                  <Typography>Active members</Typography>
                </StatBox>
                <StatBox>
                  <Typography variant="h3">1000+</Typography>
                  <Typography>Monthly events</Typography>
                </StatBox>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, margin: 'auto 0' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={4.5} precision={0.5} readOnly />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      4.5
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Average event rating
                  </Typography>
                </Box>
              </StatsContainer>
            </Box>

            <Box
              sx={{
                flex: 1,
                display: { xs: 'none', md: 'block' },
                position: 'relative',
                height: '600px',
              }}
            ></Box>
          </Box>
        </Container>
      </HeroSection>
    </>
  );
}
