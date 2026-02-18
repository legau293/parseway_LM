import React from 'react';
import AuthForm from '@/components/auth/AuthForm';
import AuthLayout from '@/components/layouts/AuthLayout';

const Auth = () => {
  return (
    <AuthLayout>
      <AuthForm />
    </AuthLayout>
  );
};

export default Auth;
