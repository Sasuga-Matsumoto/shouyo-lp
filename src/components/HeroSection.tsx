import TrackedLink from '@/src/components/TrackedLink';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-glow"></div>
      <div className="inner">
        <div className="hero-label">PLEX INSURANCE OPTIMIZATION</div>
        <h1 className="hero-title">年収を変えずに<br />社会保険料を年間143万円削減</h1>
        <div className="hero-sub-pitch">
          <span>否認リスク保証付き</span>
          <span>届出・管理すべてお任せ</span>
          <span>年に2〜3回承認するだけ</span>
        </div>
        <div className="cta-group">
          <TrackedLink href="/contact/" className="btn btn-primary" eventParams={{ form_type: 'contact', cta_location: 'hero' }}>まずは問い合わせする</TrackedLink>
        </div>
      </div>
    </section>
  );
}
