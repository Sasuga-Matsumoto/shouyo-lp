'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getUtmParams, submitToGAS } from '@/src/lib/gas';
import { scrollToFirstError } from '@/src/lib/form-utils';
import { getActiveVariant } from '@/src/lib/ab-tests';

interface FormErrors {
  company?: string;
  lastName?: string;
  firstName?: string;
  email?: string;
  phone?: string;
  employees?: string;
  position?: string;
  referralSource?: string;
}

function FadeIn({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`fade-in${visible ? ' visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

export default function DownloadForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function validate(): FormErrors | null {
    const form = formRef.current;
    if (!form) return {};
    const newErrors: FormErrors = {};

    const company = (form.elements.namedItem('company') as HTMLInputElement).value.trim();
    if (!company) newErrors.company = '会社名を入力してください';

    const lastName = (form.elements.namedItem('lastName') as HTMLInputElement).value.trim();
    if (!lastName) newErrors.lastName = '姓を入力してください';

    const firstName = (form.elements.namedItem('firstName') as HTMLInputElement).value.trim();
    if (!firstName) newErrors.firstName = '名を入力してください';

    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    if (!email) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '正しいメールアドレスを入力してください';
    }

    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value.trim();
    if (!phone) {
      newErrors.phone = '電話番号を入力してください';
    } else if (!/^[\d\-+() ]{8,}$/.test(phone)) {
      newErrors.phone = '正しい電話番号を入力してください';
    }

    const employees = (form.elements.namedItem('employees') as HTMLSelectElement).value;
    if (!employees) newErrors.employees = '従業員数を選択してください';

    const position = (form.elements.namedItem('position') as HTMLInputElement).value.trim();
    if (!position) newErrors.position = '役職を入力してください';

    const referralSource = (form.elements.namedItem('referralSource') as HTMLSelectElement).value;
    if (!referralSource) newErrors.referralSource = '流入経路を選択してください';

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(Boolean);
    return hasErrors ? newErrors : null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (validationErrors) {
      scrollToFirstError(formRef.current, validationErrors as Record<string, string | undefined>);
      return;
    }

    const form = formRef.current!;
    setSubmitting(true);

    const utm = getUtmParams();
    const data: Record<string, string> = {
      company: (form.elements.namedItem('company') as HTMLInputElement).value.trim(),
      lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value.trim(),
      firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem('email') as HTMLInputElement).value.trim(),
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value.trim(),
      employees: (form.elements.namedItem('employees') as HTMLSelectElement).value || '',
      position: (form.elements.namedItem('position') as HTMLInputElement).value.trim() || '',
      inquiry: (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim() || '',
      referralSource: (form.elements.namedItem('referralSource') as HTMLSelectElement).value || '',
      formType: '資料請求',
      ...utm,
    };

    try {
      await submitToGAS(data);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'form_submit', form_type: 'download', ab_test_variant: getActiveVariant() });
      router.push('/thanks-download/');
    } catch {
      setSubmitting(false);
      alert('送信に失敗しました。時間をおいて再度お試しください。');
    }
  }

  return (
    <>
      <section className="page-hero">
        <div className="inner">
          <div className="page-hero-label">DOWNLOAD</div>
          <h1>サービス資料ダウンロード</h1>
        </div>
      </section>

      <section className="download-section">
        <div className="download-inner">
          <FadeIn>
            <div className="doc-info-card">
              <div className="doc-label">SERVICE DOCUMENT</div>
              <h2>3分でわかる！<br />PLEX 社保最適化<br />サービス資料</h2>
              <div className="doc-thumbs">
                <Image src="/doc_thumb_flow.png" alt="導入時のメリット" width={460} height={259} loading="lazy" />
                <Image src="/doc_thumb_merit.png" alt="月額vs賞与の社会保険料比較" width={460} height={259} loading="lazy" />
              </div>
              <p className="doc-desc">社会保険料最適化の仕組みから削減効果の概算例、導入イメージまでを分かりやすくまとめた資料です。</p>
              <div className="doc-contents">
                <h3>主な内容</h3>
                <ul>
                  <li>社保最適化の概要と削減の仕組み</li>
                  <li>削減効果の概算例</li>
                  <li>導入・運用イメージ</li>
                  <li>否認補償（SLA）</li>
                </ul>
              </div>
            </div>
          </FadeIn>

          <FadeIn className="form-column">
            <div className="form-card">
              <div className="form-card-title">30秒で今すぐダウンロード！</div>
              <form ref={formRef} onSubmit={handleSubmit} noValidate>

                <div className="input-group">
                  <label htmlFor="company">会社名<span className="required">必須</span></label>
                  <input type="text" id="company" name="company" placeholder="例: 株式会社プレックス" className={errors.company ? 'input-error' : ''} required />
                  <div className="inline-error">{errors.company || ''}</div>
                </div>

                <div className="input-group">
                  <label>氏名<span className="required">必須</span></label>
                  <div className="input-row">
                    <div>
                      <input type="text" id="lastName" name="lastName" placeholder="姓" className={errors.lastName ? 'input-error' : ''} required />
                      <div className="inline-error">{errors.lastName || ''}</div>
                    </div>
                    <div>
                      <input type="text" id="firstName" name="firstName" placeholder="名" className={errors.firstName ? 'input-error' : ''} required />
                      <div className="inline-error">{errors.firstName || ''}</div>
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="email">メールアドレス<span className="required">必須</span></label>
                  <input type="email" id="email" name="email" placeholder="例: info@example.com" className={errors.email ? 'input-error' : ''} required />
                  <div className="inline-error">{errors.email || ''}</div>
                </div>

                <div className="input-group">
                  <label htmlFor="phone">電話番号<span className="required">必須</span></label>
                  <input type="tel" id="phone" name="phone" placeholder="例: 03-1234-5678" className={errors.phone ? 'input-error' : ''} required />
                  <div className="inline-error">{errors.phone || ''}</div>
                </div>

                <div className="input-group">
                  <label htmlFor="employees">従業員数<span className="required">必須</span></label>
                  <select id="employees" name="employees" className={errors.employees ? 'input-error' : ''} required>
                    <option value="">選択してください</option>
                    <option value="1-10">1〜10名</option>
                    <option value="11-30">11〜30名</option>
                    <option value="31-50">31〜50名</option>
                    <option value="51-100">51〜100名</option>
                    <option value="101-300">101〜300名</option>
                    <option value="301+">301名以上</option>
                  </select>
                  <div className="inline-error">{errors.employees || ''}</div>
                </div>

                <div className="input-group">
                  <label htmlFor="position">役職<span className="required">必須</span></label>
                  <input type="text" id="position" name="position" placeholder="例: 代表取締役" className={errors.position ? 'input-error' : ''} required />
                  <div className="inline-error">{errors.position || ''}</div>
                </div>

                <div className="input-group">
                  <label htmlFor="message">ご質問・ご要望</label>
                  <textarea id="message" name="message" rows={4} placeholder="ご質問やご要望があればご記入ください" />
                </div>

                <div className="input-group">
                  <label htmlFor="referralSource">PLEX社保最適化をどこで知りましたか？<span className="required">必須</span></label>
                  <select id="referralSource" name="referralSource" className={errors.referralSource ? 'input-error' : ''} required>
                    <option value="">選択してください</option>
                    <option value="Facebook/Instagram">Facebook/Instagram</option>
                    <option value="WEB検索">WEB検索</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="X（旧Twitter）">X（旧Twitter）</option>
                    <option value="展示会">展示会</option>
                    <option value="イベント">イベント</option>
                    <option value="知人/取引先からの紹介">知人/取引先からの紹介</option>
                    <option value="その他">その他</option>
                  </select>
                  <div className="inline-error">{errors.referralSource || ''}</div>
                </div>

                <p className="privacy-consent">
                  以下のボタンを押すと、<a href="/privacy/" target="_blank" rel="noopener noreferrer">プライバシーポリシー</a>に同意したものとみなされます。
                </p>

                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? '送信中...' : '資料請求する'}
                </button>
              </form>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
