'use client';

import { useEffect } from 'react';
import { captureUtmParams } from '@/src/lib/gas';

export default function UtmCapture() {
  useEffect(() => {
    captureUtmParams();
  }, []);
  return null;
}
