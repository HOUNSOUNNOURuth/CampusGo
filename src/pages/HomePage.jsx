import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useI18n } from '../i18n/I18nContext.jsx';
import Reveal from '../components/ui/Reveal.jsx';

// Aperçu satellite du hero — mêmes coordonnées réelles que le module de
// guidage (Entrée principale -> Bibliothèque Centrale -> EPAC), en lecture
// seule (pas de zoom/déplacement, c'est une vitrine, pas la vraie carte).
const HERO_START = { lat: 6.4489, lng: 2.3480 };
const HERO_MID = { lat: 6.4492, lng: 2.3496 };
const HERO_DEST = { lat: 6.4508, lng: 2.3462 };
const HERO_CENTER = [6.4496, 2.3479];

function heroDotIcon(color, delayMs) {
  return L.divIcon({
    className: '',
    html: `<div class="marker" style="animation-delay:${delayMs}ms;width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #0A0F07;box-shadow:0 0 0 2px rgba(255,255,255,.5);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
}

function heroPinIcon(delayMs) {
  return L.divIcon({
    className: '',
    // deux divs imbriqués : le style="marker" anime scale/opacity (apparition),
    // le div interne garde sa rotation fixe (forme de goutte) sans conflit.
    html: `<div class="marker" style="animation-delay:${delayMs}ms;"><div style="width:22px;height:22px;border-radius:50% 50% 50% 0;background:var(--route-orange);border:2px solid #fff;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,.4);"></div></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 22]
  });
}

export default function HomePage() {
  const { t } = useI18n();

  return (
    <>
      {/* ---------- Hero : fond plein cadre (carte satellite) + texte en superposition ---------- */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-media">
            <div className="hero-media-bg">
              <MapContainer
                center={HERO_CENTER} zoom={16} style={{ height: '100%', width: '100%' }}
                zoomControl={false} dragging={false} scrollWheelZoom={false}
                doubleClickZoom={false} touchZoom={false} boxZoom={false} keyboard={false}
                attributionControl={false}
              >
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="Tiles &copy; Esri"
                />
                <Polyline
                  positions={[[HERO_START.lat, HERO_START.lng], [HERO_MID.lat, HERO_MID.lng], [HERO_DEST.lat, HERO_DEST.lng]]}
                  pathOptions={{ color: '#3D8BFF', weight: 4, dashArray: '1 10', className: 'route-path' }}
                />
                <Marker position={[HERO_START.lat, HERO_START.lng]} icon={heroDotIcon('#3D8BFF', 150)} />
                <Marker position={[HERO_MID.lat, HERO_MID.lng]} icon={heroDotIcon('var(--amber)', 400)} />
                <Marker position={[HERO_DEST.lat, HERO_DEST.lng]} icon={heroPinIcon(650)} />
              </MapContainer>
            </div>

            <div className="hero-media-overlay" />

            <div className="hero-media-content">
              <div className="sat-badge"><span className="dot" />Vue satellite — en direct</div>
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
          </div>
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
