'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import TrackedLink from '@/src/components/TrackedLink';

type Variant = 'top' | 'contact' | 'download' | 'thanks-contact' | 'thanks-download' | 'privacy';

export default function Header({ variant = 'top' }: { variant?: Variant }) {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const renderNav = () => {
    if (variant === 'top') {
      return (
        <ul className="header-nav">
          <li><TrackedLink href="/contact/" eventParams={{ form_type: 'contact', cta_location: 'header' }}>お問い合わせ</TrackedLink></li>
        </ul>
      );
    }
    if (variant === 'download') {
      return (
        <ul className="header-nav">
          <li><Link href="/">サービスサイト</Link></li>
          <li><TrackedLink href="/contact/" className="btn btn-primary" style={{ padding: '10px 36px 10px 22px', fontSize: '0.82rem', color: 'white', backgroundPosition: 'right 14px center' }} eventParams={{ form_type: 'contact', cta_location: 'header' }}>お問い合わせ</TrackedLink></li>
        </ul>
      );
    }
    if (variant === 'thanks-download') {
      return (
        <ul className="header-nav">
          <li><Link href="/">サービスサイト</Link></li>
          <li><TrackedLink href="/contact/" className="btn btn-primary" style={{ padding: '10px 36px 10px 22px', fontSize: '0.82rem', color: 'white', backgroundPosition: 'right 14px center' }} eventParams={{ form_type: 'contact', cta_location: 'header' }}>お問い合わせ</TrackedLink></li>
        </ul>
      );
    }
    // contact, thanks-contact, privacy
    return (
      <ul className="header-nav">
        <li><Link href="/">サービスサイト</Link></li>
        <li><TrackedLink href="/download/" className="btn btn-primary" style={{ padding: '10px 36px 10px 22px', fontSize: '0.82rem', color: 'white', backgroundPosition: 'right 14px center' }} eventParams={{ form_type: 'download', cta_location: 'header' }}>資料請求</TrackedLink></li>
      </ul>
    );
  };

  const renderMobileMenu = () => {
    if (variant === 'top') {
      return (
        <div className={`mobile-menu${isOpen ? ' active' : ''}`}>
          <TrackedLink href="/contact/" onClick={closeMenu} eventParams={{ form_type: 'contact', cta_location: 'header_mobile' }}>お問い合わせ</TrackedLink>
        </div>
      );
    }
    if (variant === 'download') {
      return (
        <div className={`mobile-menu${isOpen ? ' active' : ''}`}>
          <Link href="/" onClick={closeMenu}>サービスサイト</Link>
          <TrackedLink href="/contact/" onClick={closeMenu} eventParams={{ form_type: 'contact', cta_location: 'header_mobile' }}>お問い合わせ</TrackedLink>
        </div>
      );
    }
    if (variant === 'thanks-download') {
      return (
        <div className={`mobile-menu${isOpen ? ' active' : ''}`}>
          <Link href="/" onClick={closeMenu}>サービスサイト</Link>
          <TrackedLink href="/contact/" onClick={closeMenu} eventParams={{ form_type: 'contact', cta_location: 'header_mobile' }}>お問い合わせ</TrackedLink>
        </div>
      );
    }
    // contact, thanks-contact, privacy
    return (
      <div className={`mobile-menu${isOpen ? ' active' : ''}`}>
        <Link href="/" onClick={closeMenu}>サービスサイト</Link>
        <TrackedLink href="/download/" onClick={closeMenu} eventParams={{ form_type: 'download', cta_location: 'header_mobile' }}>資料請求</TrackedLink>
      </div>
    );
  };

  return (
    <header className="header" ref={headerRef}>
      <Link href="/" className="header-left">
        <img src="/logo.png" alt="PLEX" className="header-logo-img" />
        <div className="header-logo">PLEX <span>社保最適化</span></div>
      </Link>
      <nav>
        {renderNav()}
      </nav>
      <button
        className={`hamburger${isOpen ? ' active' : ''}`}
        aria-label="メニュー"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span></span><span></span><span></span>
      </button>
      {renderMobileMenu()}
    </header>
  );
}
