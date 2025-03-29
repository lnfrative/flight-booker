'use client';

import * as React from 'react';
import { FormEvent, useState } from 'react';
import { createUser } from '@/actions';

import {
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  FormLabel,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';

import { useRouter } from 'next-nprogress-bar';

interface State {
  loading: boolean
}

const initialState: State = {
  loading: false,
}

export default function Register() {
  const [state, setState] = useState(initialState);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setState({ loading: true });

    const result = await createUser(data);

    setState({ loading: false });

    if (result.success) {
      router.push('/')
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
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'center',
            width: '100%',
            padding: theme.spacing(4),
            gap: theme.spacing(2),
            margin: 'auto',
            boxShadow:
              'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
            [theme.breakpoints.up('sm')]: {
              width: '450px',
            },
            ...theme.applyStyles('dark', {
              boxShadow:
                'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
            }),
          })}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Nombre</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Jon Snow"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Correo electrónico</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Contraseña</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={state.loading}
            >
              Crear cuenta
              {state.loading && (<CircularProgress sx={{ ml: 1 }} color='inherit' size={14} />)}
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              ¿Ya tienes una cuenta?{' '}
              <Link component={NextLink} href="/login/" variant="body2" sx={{ alignSelf: 'center' }}>
                Iniciar sesión
              </Link>
            </Typography>
          </Box>
        </Card>
      </Stack>
    </Stack>
  );
}