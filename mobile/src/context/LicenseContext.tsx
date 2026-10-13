import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

export type LicenseStatus = 'not_submitted' | 'pending' | 'verified' | 'rejected';

export interface LicenseSubmission {
  owner: string;
  licenseNo: string;
  expiry: string;
  fileName: string;
  submittedAt: string;
}

export const LICENSE_STATUS_LABEL: Record<LicenseStatus, string> = {
  not_submitted: 'Not submitted',
  pending: 'Pending review',
  verified: 'Verified',
  rejected: 'Needs correction',
};

interface Ctx {
  status: LicenseStatus;
  submission: LicenseSubmission | null;
  rejectReason: string;
  submit: (s: LicenseSubmission) => void;
}

const LicenseCtx = createContext<Ctx | null>(null);

/**
 * Driver's-license state. The Laravel API has no endpoint for submitting a license after sign-up,
 * so (like the web prototype) the submission is local; unlike the prototype it is saved on the
 * device per user, so it survives app restarts. Verification can only ever be set by PASS staff
 * once a backend endpoint exists; the app never marks a license as verified by itself.
 */
export function LicenseProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const key = user ? `pass_license_${user.id}` : null;
  const [status, setStatus] = useState<LicenseStatus>('not_submitted');
  const [submission, setSubmission] = useState<LicenseSubmission | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    setStatus('not_submitted');
    setSubmission(null);
    setRejectReason('');
    if (!key) return;
    AsyncStorage.getItem(key)
      .then(raw => {
        if (!raw) return;
        const v = JSON.parse(raw);
        setStatus(v.status);
        setSubmission(v.submission);
        setRejectReason(v.rejectReason ?? '');
      })
      .catch(() => {});
  }, [key]);

  const submit = (s: LicenseSubmission) => {
    setSubmission(s);
    setStatus('pending');
    setRejectReason('');
    if (key) AsyncStorage.setItem(key, JSON.stringify({ status: 'pending', submission: s, rejectReason: '' })).catch(() => {});
  };

  return <LicenseCtx.Provider value={{ status, submission, rejectReason, submit }}>{children}</LicenseCtx.Provider>;
}

export function useLicense() {
  const c = useContext(LicenseCtx);
  if (!c) throw new Error('useLicense must be used inside LicenseProvider');
  return c;
}
