'use client';

import { useEffect, useRef } from 'react';
import { getActiveVariant } from '@/src/lib/ab-tests';

export default function FormStartTracker({ formType }: { formType: string }) {
  const fired = useRef(false);

  useEffect(() => {
    const handler = () => {
      if (fired.current) return;
      fired.current = true;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'custom_form_start',
        form_type: formType,
        ab_test_variant: getActiveVariant(),
      });
    };

    const form = document.querySelector('form');
    if (!form) return;
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(f => f.addEventListener('focus', handler, { once: true }));

    return () => {
      fields.forEach(f => f.removeEventListener('focus', handler));
    };
  }, [formType]);

  return null;
}
