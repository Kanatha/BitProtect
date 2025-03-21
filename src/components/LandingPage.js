import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


function LandingPage() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        

        <Typography component="h1" variant="h2" gutterBottom>
          Welcome to Our Application
        </Typography>
        <Typography variant="h5" paragraph>
          Discover the features of our app and join us today.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLoginRedirect}
          sx={{ mt: 4 }}
        >
          Go to Login
        </Button>
      </Box>
    </Container>
  );
}

export default LandingPage;
