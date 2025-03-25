import { lazy } from 'react';

export const LoginFormAsync = lazy(() => import('./ui/LoginForm').then(module => ({ default: module.default })));
