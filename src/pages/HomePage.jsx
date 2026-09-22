import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext.jsx';
import Reveal from '../components/ui/Reveal.jsx';

export default function HomePage() {
  const { t } = useI18n();

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="wrap">
          <Reveal className="hero-card">
            <div className="hero-grid">
              <div>
                <div className="eyebrow-line">
                  <span className="dash" />
                  {t('hero.eyebrow')}
                </div>
                <h1>{t('hero.title')}</h1>
                <p className="lead">{t('hero.lead')}</p>
                <div className="hero-actions">
                  <Link to="/itineraire" className="btn btn-primary">{t('hero.cta1')}</Link>
                  <Link to="/inscription" className="btn btn-ghost">{t('hero.cta2')}</Link>
                </div>
                <p className="hero-note">{t('hero.note')}</p>
              </div>

              <Reveal className="map-art" delay={150}>
                <div className="sat-badge"><span className="dot" />Vue satellite — en direct</div>
                <svg className="overlay" viewBox="0 0 400 300" preserveAspectRatio="none">
                  <rect x="30" y="40" width="46" height="30" rx="4" fill="rgba(255,255,255,.10)" />
                  <rect x="290" y="150" width="60" height="40" rx="4" fill="rgba(255,255,255,.10)" />
                  <rect x="230" y="60" width="40" height="26" rx="4" fill="rgba(255,255,255,.08)" />
                  <path
                    className="route-path"
                    d="M 60 260 C 100 220, 90 170, 140 150 S 220 110, 260 60"
                    fill="none" stroke="var(--route-blue)" strokeWidth="4"
                    strokeLinecap="round" strokeDasharray="1 10"
                  />
                  <circle className="marker" style={{ animationDelay: '150ms' }}
                    cx="60" cy="260" r="7" fill="var(--route-blue)" stroke="#0A0F07" strokeWidth="2" />
                  <circle className="marker" style={{ animationDelay: '400ms' }}
                    cx="140" cy="150" r="6" fill="var(--amber)" stroke="#0A0F07" strokeWidth="2" />
                  <g className="marker" style={{ animationDelay: '650ms' }} transform="translate(260,60)">
                    <path d="M0 -16 C9 -16 16 -9 16 0 C16 11 0 26 0 26 C0 26 -16 11 -16 0 C-16 -9 -9 -16 0 -16Z" fill="var(--route-orange)" stroke="#0A0F07" strokeWidth="2" />
                    <circle cx="0" cy="-2" r="4.5" fill="#0A0F07" />
                  </g>
                </svg>
                <button className="reset-btn" type="button" aria-label="Centrer la carte">⌖</button>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Comment ça marche ---------- */}
      <section>
        <div className="wrap">
          <Reveal className="section-head">
            <span className="kicker">{t('how.kicker')}</span>
            <h2>{t('how.title')}</h2>
          </Reveal>
          <div className="steps3">
            <Reveal delay={0}>
              <div className="step-card">
                <div className="step-num">1</div>
                <h3>{t('how.s1.title')}</h3>
                <p>{t('how.s1.body')}</p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="step-card">
                <div className="step-num">2</div>
                <h3>{t('how.s2.title')}</h3>
                <p>{t('how.s2.body')}</p>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="step-card">
                <div className="step-num">3</div>
                <h3>{t('how.s3.title')}</h3>
                <p>{t('how.s3.body')}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Fonctionnalités ---------- */}
      <section>
        <div className="wrap">
          <Reveal className="section-head">
            <span className="kicker">{t('feat.kicker')}</span>
            <h2>{t('feat.title')}</h2>
          </Reveal>
          <div className="features">
            <Reveal delay={0}>
              <div className="feature">
                <div className="ficon-badge">🧭</div>
                <h3>{t('feat.a.title')}</h3>
                <p>{t('feat.a.body')}</p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="feature">
                <div className="ficon-badge">🗺️</div>
                <h3>{t('feat.b.title')}</h3>
                <p>{t('feat.b.body')}</p>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="feature">
                <div className="ficon-badge">🕓</div>
                <h3>{t('feat.c.title')}</h3>
                <p>{t('feat.c.body')}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Tarifs ---------- */}
      <section>
        <div className="wrap">
          <Reveal className="section-head">
            <span className="kicker">{t('price.kicker')}</span>
            <h2>{t('price.title')}</h2>
            <p>{t('price.body')}</p>
          </Reveal>
          <div className="pricing-grid">
            <Reveal delay={0}>
              <div className="price-card">
                <span className="tag">{t('price.free.tag')}</span>
                <h3>{t('price.free.title')}</h3>
                <div className="amount">0 <span>{t('price.currency')}</span></div>
                <ul>
                  <li>✓ <span>{t('price.free.l1')}</span></li>
                  <li>✓ <span>{t('price.free.l2')}</span></li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="price-card highlight">
                <span className="tag">{t('price.pack1.tag')}</span>
                <h3>{t('price.pack1.title')}</h3>
                <div className="amount">1000 <span>{t('price.currency')}</span></div>
                <ul>
                  <li>✓ <span>{t('price.pack1.l1')}</span></li>
                  <li>✓ <span>{t('price.pack1.l2')}</span></li>
                </ul>
                <button className="btn btn-primary btn-block">{t('price.select')}</button>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="price-card">
                <span className="tag">{t('price.pack2.tag')}</span>
                <h3>{t('price.pack2.title')}</h3>
                <div className="amount">2500 <span>{t('price.currency')}</span></div>
                <ul>
                  <li>✓ <span>{t('price.pack2.l1')}</span></li>
                  <li>✓ <span>{t('price.pack2.l2')}</span></li>
                </ul>
                <button className="btn btn-ghost btn-block">{t('price.select')}</button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
