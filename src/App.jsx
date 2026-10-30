import Generator from './components/Generator'
import {
  ArrowDownIcon,
  ArrowUpRightIcon,
  FileIcon,
  LinkIcon,
  QrMark,
  SlidersIcon,
  StarIcon,
} from './components/Icons'
import './App.css'

const MARQUEE_ITEMS = [
  'Sin registro',
  'PNG + SVG',
  '16 tintas oscuras',
  'Sin marca de agua',
  'Escaneo directo',
  'RUIDO QR',
]

function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <div className="marquee__content" key={copy}>
            {MARQUEE_ITEMS.map((item) => (
              <span className="marquee__item" key={`${copy}-${item}`}>
                {item}
                <StarIcon className="marquee__star" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label="RUIDO QR, volver al inicio">
        <span className="brand__mark">
          <QrMark />
        </span>
        <span className="brand__name">
          RUIDO<span className="brand__asterisk">*</span>QR
        </span>
      </a>

      <nav className="site-nav" aria-label="Navegación principal">
        <a href="#generador">Generador</a>
        <a href="#proceso">Proceso</a>
        <a href="#formatos">Formatos</a>
      </nav>

      <a className="header-cta" href="#generador">
        <span className="header-cta__dot" />
        Crear gratis
        <ArrowUpRightIcon />
      </a>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero__meta">
        <span className="eyebrow">
          <span className="eyebrow__dot" />
          Estudio de códigos QR
        </span>
        <span className="hero__issue">Edición 001 / MMXXVI</span>
      </div>

      <div className="hero__grid">
        <div className="hero__title-wrap">
          <h1 className="hero__title" id="hero-title">
            <span className="hero__line">Tu link,</span>
            <span className="hero__line">
              <span className="hero__highlight">hecho</span>
            </span>
            <span className="hero__line hero__line--outline">
              código<span className="hero__period">.</span>
            </span>
          </h1>

          <div className="hero__stamp" aria-hidden="true">
            <span>PNG</span>
            <StarIcon />
            <span>SVG</span>
          </div>
        </div>

        <div className="hero__aside">
          <p className="hero__lead">
            Pegá una URL. Elegí el tamaño y la tinta. Llevate un QR{' '}
            <strong>en PNG o SVG</strong> que no pasa desapercibido.
          </p>

          <a className="button-primary" href="#generador">
            <span>Crear mi QR</span>
            <ArrowDownIcon />
          </a>

          <dl className="hero__stats">
            <div>
              <dt>Colores</dt>
              <dd>16</dd>
            </div>
            <div>
              <dt>Formatos</dt>
              <dd>02</dd>
            </div>
            <div>
              <dt>Límites</dt>
              <dd>∞</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="hero__ticker" aria-hidden="true">
        <span>Diseñado para el teléfono que todos llevamos en el bolsillo</span>
        <StarIcon />
        <span>Sin apps. Sin cuentas. Sin vueltas.</span>
      </div>
    </section>
  )
}

function Process() {
  return (
    <section className="process" id="proceso" aria-labelledby="process-title">
      <div className="process__intro">
        <div>
          <p className="eyebrow">
            <StarIcon />
            Cómo funciona
          </p>
          <h2 id="process-title">
            Tres pasos.
            <span>Cero drama.</span>
          </h2>
        </div>

        <p className="process__lead">
          Un generador que vive en tu navegador. Tu link no se sube a ningún
          servidor y el QR sale limpio, sin marcas de agua.
        </p>
      </div>

      <div className="process__cards">
        <article className="step step--yellow">
          <span className="step__number" aria-hidden="true">
            01
          </span>
          <span className="step__icon">
            <LinkIcon />
          </span>
          <h3>Pegá el link</h3>
          <p>
            Una web, un perfil o una playlist. Si no trae <code>https://</code>,
            lo completamos por vos.
          </p>
          <span className="step__tag">Empezá acá</span>
        </article>

        <article className="step step--pink">
          <span className="step__number" aria-hidden="true">
            02
          </span>
          <span className="step__icon">
            <SlidersIcon />
          </span>
          <h3>Ajustá a tu medida</h3>
          <p>
            Deslizá el tamaño y elegí entre 16 tintas oscuras pensadas para
            escanear sin dudas.
          </p>
          <span className="step__tag">Tamaño + color</span>
        </article>

        <article className="step step--lime">
          <span className="step__number" aria-hidden="true">
            03
          </span>
          <span className="step__icon">
            <FileIcon />
          </span>
          <h3>Descargá y hacé ruido</h3>
          <p>
            PNG para pegar en cualquier lado. SVG para escalar sin perder un
            solo píxel.
          </p>
          <span className="step__tag">PNG / SVG</span>
        </article>
      </div>

      <div className="formats" id="formatos">
        <span className="formats__title">Formatos de salida</span>
        <span className="format-chip format-chip--png">
          PNG <small>ráster</small>
        </span>
        <span className="format-chip format-chip--svg">
          SVG <small>vector</small>
        </span>
        <span className="formats__separator" aria-hidden="true">
          ×
        </span>
        <span className="formats__text">
          Alto contraste. Sin marca de agua. Listo para imprimir, pegar o mandar
          por chat.
        </span>
      </div>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-cta">
          <div>
            <p className="eyebrow eyebrow--invert">
              <span className="eyebrow__dot" />
              Ya tenés el link
            </p>
            <h2>
              hacé<span>ruido.</span>
            </h2>
          </div>

          <div className="footer-cta__aside">
            <p>
              Tu QR está a un scroll. Elegí tinta, tamaño y bajalo en PNG o SVG.
            </p>
            <a className="button-primary button-primary--lime" href="#generador">
              <span>Ir al generador</span>
              <ArrowUpRightIcon />
            </a>
          </div>
        </div>

        <p className="footer-wordmark" aria-hidden="true">
          RUIDO<span>*</span>QR
        </p>

        <div className="footer-bottom">
          <span>© 2026 RUIDO QR</span>
          <span>Hecho con React + cafeína</span>
          <span>Sin cuentas. Sin cookies. Sin vueltas.</span>
          <a href="#inicio">
            Volver arriba <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  )
}

function App() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#generador">
        Saltar al generador
      </a>

      <Marquee />

      <div className="page">
        <SiteHeader />

        <main>
          <Hero />
          <Generator />
          <Process />
        </main>
      </div>

      <SiteFooter />
    </div>
  )
}

export default App
