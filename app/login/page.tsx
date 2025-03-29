'use client';

import React, { FormEvent, useState } from 'react';
import { loginUser } from '@/actions';
import { Box, Button, Card, CircularProgress, FormControl, FormLabel, Link, Stack, TextField, Typography } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next-nprogress-bar';

interface State {
  loading: boolean;
}

const initialState: State = {
  loading: false,
};

export default function Signin() {
  const [state, setState] = useState(initialState);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
  
    setState({ loading: true });
  
    const result = await loginUser(data);
  
    setState({ loading: false });
  
    if (result.success) {
      router.push('/');
    }
  };

  return (
    <Stack direction="column" justifyContent="space-between">
      <Stack
        sx={{
          justifyContent: 'center',
          height: '100dvh',
          p: 2,
        }}
      >
        <Card
          variant="outlined"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'center',
            width: '100%',
            padding: 4,
            gap: 2,
            margin: 'auto',
            maxWidth: 450,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Correo electrónico</FormLabel>
              <TextField
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Contraseña</FormLabel>
              <TextField
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={state.loading}
            >
              Iniciar sesión
              {state.loading && <CircularProgress sx={{ ml: 1 }} color="inherit" size={14} />}
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              ¿No tienes cuenta?{' '}
              <Link component={NextLink} href="/register/" variant="body2" sx={{ alignSelf: 'center' }}>
                Crear cuenta
              </Link>
            </Typography>
          </Box>
        </Card>
      </Stack>
    </Stack>
  );
}