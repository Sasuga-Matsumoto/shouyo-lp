'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export default function ThanksPageView({ formType }: { formType: string }) {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'conversion_page_view',
      form_type: formType,
    });
  }, [formType]);

  return null;
}
