'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export default function ABTestImpression({ testId, variant }: { testId: string; variant: string }) {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'ab_test_impression',
      ab_test_name: testId,
      ab_test_variant: variant,
    });
  }, [testId, variant]);

  return null;
}
