'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { AuthCard } from '../auth-card';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { useAuth } from '@/hooks/useAuth';

export default function OtpVerificationForm(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.verify(email, otp);
      toast({
        title: 'Success',
        description: 'Email verified successfully',
      });
      router.push('/auth/login');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify OTP';

      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await auth.resend(email);
      toast({
        title: 'Success',
        description: 'OTP resent successfully',
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend OTP';

      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
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
      <AuthCard title="Verify Email">
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Enter OTP sent to <strong>{email}</strong>
          </p>
          <div className="flex justify-center">
            <InputOTP
              maxLength={5}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              value={otp}
              onChange={setOtp}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#4338ca] hover:bg-[#3730a3] disabled:opacity-50"
            disabled={loading || otp.length !== 5}
            aria-disabled={loading || otp.length !== 5}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={(e) => void handleResendOtp(e)}
            disabled={loading}
          >
            Resend OTP
          </Button>
        </form>
      </AuthCard>
    </motion.div>
  );
}

