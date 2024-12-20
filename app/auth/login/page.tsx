'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { AuthCard } from '../auth-card';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const auth = useAuth();
  const { user, loading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await auth.login(formData.email, formData.password);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to login',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <AuthCard title="Login">
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={formData.rememberMe}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, rememberMe: checked as boolean })
                }
              />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <Link href="/auth/forgot-password" className="text-sm text-[#4338ca]">
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#4338ca] hover:bg-[#3730a3]"
            disabled={loading}
          >
            {loading ? 'Please wait...' : 'Login'}
          </Button>
          <div className="text-center text-sm">
            <p>
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-[#4338ca] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </AuthCard>
    </motion.div>
  );
}
