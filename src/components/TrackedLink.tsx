'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

interface TrackedLinkProps extends ComponentProps<typeof Link> {
  eventName?: string;
  eventParams?: Record<string, string>;
}

export default function TrackedLink({
  eventName = 'cta_click',
  eventParams = {},
  onClick,
  children,
  ...props
}: TrackedLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...eventParams,
    });
    if (onClick) onClick(e);
  };

  return (
    <Link {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}
