import { useEffect, useMemo, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { QR_COLORS } from '../data/colors'
import {
  ArrowDownIcon,
  CheckIcon,
  DownloadIcon,
  GhostQr,
  LinkIcon,
  StarIcon,
  XIcon,
} from './Icons'

const MIN_SIZE = 256
const MAX_SIZE = 1600
const SIZE_STEP = 32
const PREVIEW_SIZE = 760
const SAMPLE_URL = 'https://ejemplo.com/tu-proyecto'

const SIZE_PRESETS = [
  { label: 'S', value: 256 },
  { label: 'M', value: 512 },
  { label: 'L', value: 1024 },
  { label: 'XL', value: 1600 },
]

const INVALID_LINK = { status: 'invalid', url: '', host: '' }

function normalizeLink(rawValue) {
  const raw = rawValue.trim()

  if (!raw) {
    return { status: 'empty', url: '', host: '' }
  }

  if (/\s/.test(raw)) {
    return INVALID_LINK
  }

  const hasProtocol = /^[a-z][a-z\d+.-]*:/i.test(raw)
  const candidate = hasProtocol ? raw : `https://${raw}`

  try {
    const parsed = new URL(candidate)

    if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname.includes('.')) {
      return INVALID_LINK
    }

    return {
      status: 'valid',
      url: parsed.href,
      host: parsed.hostname.replace(/^www\./, ''),
    }
  } catch {
    return INVALID_LINK
  }
}

function makeFileName(url, colorHex, extension) {
  let host = 'codigo'

  try {
    host = new URL(url).hostname.replace(/^www\./, '')
  } catch {
    // The fallback name is good enough if the URL cannot be parsed.
  }

  const slug =
    host
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase() || 'codigo'

  return `qr-${slug}-${colorHex.replace('#', '').toLowerCase()}.${extension}`
}

function triggerDownload(href, fileName) {
  const anchor = document.createElement('a')
  anchor.href = href
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}

export default function Generator() {
  const [link, setLink] = useState('')
  const [size, setSize] = useState(512)
  const [selectedColor, setSelectedColor] = useState(QR_COLORS[0])
  const [previewSrc, setPreviewSrc] = useState('')
  const [previewLoading, setPreviewLoading] = useState(false)
  const [downloadState, setDownloadState] = useState(null)
  const [toast, setToast] = useState(null)

  const inputRef = useRef(null)
  const toastTimer = useRef(null)
  const previewRequest = useRef(0)

  const currentLink = useMemo(() => normalizeLink(link), [link])
  const showError = link.trim().length > 0 && currentLink.status === 'invalid'
  const hasQr = currentLink.status === 'valid' && Boolean(previewSrc)
  const progress = ((size - MIN_SIZE) / (MAX_SIZE - MIN_SIZE)) * 100
  const downloadsDisabled = !hasQr || Boolean(downloadState)

  useEffect(() => {
    return () => {
      window.clearTimeout(toastTimer.current)
      previewRequest.current += 1
    }
  }, [])

  function showToast(message, tone = 'success') {
    window.clearTimeout(toastTimer.current)
    setToast({ message, tone, id: Date.now() })
    toastTimer.current = window.setTimeout(() => setToast(null), 3800)
  }

  async function generatePreview(url, colorHex) {
    const requestId = previewRequest.current + 1
    previewRequest.current = requestId
    setPreviewLoading(true)

    try {
      const dataUrl = await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'H',
        margin: 4,
        width: PREVIEW_SIZE,
        color: {
          dark: colorHex,
          light: '#ffffff',
        },
      })

      if (previewRequest.current === requestId) {
        setPreviewSrc(dataUrl)
      }
    } catch {
      if (previewRequest.current === requestId) {
        setPreviewSrc('')
      }
    } finally {
      if (previewRequest.current === requestId) {
        setPreviewLoading(false)
      }
    }
  }

  function cancelPreview() {
    previewRequest.current += 1
    setPreviewSrc('')
    setPreviewLoading(false)
  }

  function applyLink(nextLink) {
    setLink(nextLink)

    const normalized = normalizeLink(nextLink)

    if (normalized.status === 'valid') {
      generatePreview(normalized.url, selectedColor.hex)
    } else {
      cancelPreview()
    }
  }

  function clearLink() {
    applyLink('')
    inputRef.current?.focus()
  }

  function fillSample() {
    applyLink(SAMPLE_URL)
  }

  function selectColor(color) {
    setSelectedColor(color)

    if (currentLink.status === 'valid') {
      generatePreview(currentLink.url, color.hex)
    }
  }

  async function handleDownload(format) {
    if (currentLink.status !== 'valid' || downloadState) {
      return
    }

    setDownloadState(format)

    const options = {
      errorCorrectionLevel: 'H',
      margin: 4,
      width: size,
      color: {
        dark: selectedColor.hex,
        light: '#ffffff',
      },
    }

    try {
      if (format === 'png') {
        const pngDataUrl = await QRCode.toDataURL(currentLink.url, options)
        triggerDownload(
          pngDataUrl,
          makeFileName(currentLink.url, selectedColor.hex, 'png'),
        )
        showToast(`PNG descargado · ${size} × ${size} px`)
      } else {
        const svgMarkup = await QRCode.toString(currentLink.url, {
          ...options,
          type: 'svg',
        })
        const svgBlob = new Blob([svgMarkup], {
          type: 'image/svg+xml;charset=utf-8',
        })
        const svgUrl = URL.createObjectURL(svgBlob)
        triggerDownload(
          svgUrl,
          makeFileName(currentLink.url, selectedColor.hex, 'svg'),
        )
        window.setTimeout(() => URL.revokeObjectURL(svgUrl), 2000)
        showToast('SVG descargado · escala sin perder nitidez')
      }
    } catch {
      showToast('Algo falló al generar el archivo. Probá otra vez.', 'error')
    } finally {
      setDownloadState(null)
    }
  }

  return (
    <section className="generator-section" id="generador" aria-labelledby="generator-title">
      <div className="section-heading">
        <span className="section-heading__index">02</span>
        <h2 id="generator-title">El generador</h2>
        <p className="section-heading__note">
          <StarIcon />
          Sin registro · sin rodeos
        </p>
      </div>

      <div className="console">
        <div className="console__bar">
          <div className="console__dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="console__path">
            RUIDO_QR <span>/</span> MAKER_001
          </p>
          <p className="console__status">
            <span className="live-dot" />
            Sistema en línea
          </p>
        </div>

        <div className="console__body">
          <div className="controls">
            <div className="control">
              <div className="control__head">
                <span className="control__number">01</span>
                <label className="control__label" htmlFor="qr-link">
                  Pegá tu link
                </label>
                <span className="control__hint">URL</span>
              </div>

              <div
                className={`link-field${showError ? ' link-field--error' : ''}${
                  hasQr ? ' link-field--valid' : ''
                }`}
              >
                <LinkIcon className="link-field__icon" />
                <input
                  ref={inputRef}
                  id="qr-link"
                  type="text"
                  inputMode="url"
                  autoCapitalize="none"
                  autoComplete="url"
                  spellCheck="false"
                  placeholder="tu-sitio.com/mi-link"
                  value={link}
                  onChange={(event) => applyLink(event.target.value)}
                  aria-invalid={showError}
                  aria-describedby="link-help"
                />
                {link && (
                  <button
                    className="link-field__clear"
                    type="button"
                    onClick={clearLink}
                    aria-label="Borrar el link"
                  >
                    <XIcon />
                  </button>
                )}
              </div>

              <p
                id="link-help"
                className={`field-help${showError ? ' field-help--error' : ''}`}
                role={showError ? 'alert' : undefined}
              >
                {showError ? (
                  'Eso no parece una URL. Probá con midominio.com/algo.'
                ) : (
                  <>
                    Si te olvidás del <code>https://</code>, lo agregamos por vos.{' '}
                    <button className="text-button" type="button" onClick={fillSample}>
                      Usar un ejemplo
                    </button>
                  </>
                )}
              </p>
            </div>

            <div className="control">
              <div className="control__head">
                <span className="control__number">02</span>
                <label className="control__label" htmlFor="qr-size">
                  Tamaño de salida
                </label>
                <output className="control__value" htmlFor="qr-size">
                  {size} × {size} px
                </output>
              </div>

              <input
                className="range"
                id="qr-size"
                type="range"
                min={MIN_SIZE}
                max={MAX_SIZE}
                step={SIZE_STEP}
                value={size}
                onChange={(event) => setSize(Number(event.target.value))}
                style={{ '--range-progress': `${progress}%` }}
              />

              <div className="range-scale" aria-hidden="true">
                <span>{MIN_SIZE} px</span>
                <span>{MAX_SIZE} px</span>
              </div>

              <div className="size-presets" role="group" aria-label="Tamaños rápidos">
                {SIZE_PRESETS.map((preset) => (
                  <button
                    className={`size-chip${size === preset.value ? ' is-active' : ''}`}
                    key={preset.value}
                    type="button"
                    onClick={() => setSize(preset.value)}
                    aria-pressed={size === preset.value}
                  >
                    <span>{preset.label}</span>
                    <small>{preset.value}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="control control--colors">
              <div className="control__head">
                <span className="control__number">03</span>
                <span className="control__label" id="color-label">
                  Elegí la tinta
                </span>
                <span className="control__hint">16 colores</span>
              </div>

              <div className="color-grid" role="group" aria-labelledby="color-label">
                {QR_COLORS.map((color) => {
                  const isActive = selectedColor.hex === color.hex

                  return (
                    <button
                      className={`swatch${isActive ? ' is-active' : ''}`}
                      key={color.hex}
                      type="button"
                      style={{ '--swatch-color': color.hex }}
                      onClick={() => selectColor(color)}
                      aria-label={color.name}
                      aria-pressed={isActive}
                      title={color.name}
                    >
                      <CheckIcon className="swatch__check" />
                    </button>
                  )
                })}
              </div>

              <div className="selected-color" aria-live="polite">
                <span
                  className="selected-color__chip"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <span className="selected-color__name">{selectedColor.name}</span>
                <code>{selectedColor.hex.toUpperCase()}</code>
                <span className="selected-color__badge">Contraste ok</span>
              </div>
            </div>
          </div>

          <aside className="qr-preview" aria-label="Vista previa y descargas">
            <div className="qr-preview__top">
              <span className="live-label">
                <span className="live-dot" />
                Vista en vivo
              </span>
              <span className="mono-label">Salida / 02 formatos</span>
            </div>

            <div
              className={`qr-stage${previewLoading ? ' is-loading' : ''}`}
              aria-busy={previewLoading}
            >
              <span className="qr-stage__tape">Escaneame · compartí · repetí</span>

              {hasQr ? (
                <figure className="qr-card">
                  <img
                    src={previewSrc}
                    alt={`Código QR para ${currentLink.url}`}
                    width="760"
                    height="760"
                  />
                  <figcaption>
                    <span>{currentLink.host}</span>
                    <span>{selectedColor.name}</span>
                  </figcaption>
                </figure>
              ) : (
                <div className="empty-qr">
                  <GhostQr className="empty-qr__ghost" />
                  <p className="empty-qr__title">
                    {showError ? 'Esperando un link válido' : 'Tu QR aparece acá'}
                  </p>
                  <p className="empty-qr__text">
                    {showError
                      ? 'Revisá la URL y probá de nuevo.'
                      : 'Pegá un link arriba para ver la magia.'}
                  </p>
                  {!showError && (
                    <button className="empty-qr__sample" type="button" onClick={fillSample}>
                      Probar con un ejemplo
                      <span aria-hidden="true">↗</span>
                    </button>
                  )}
                </div>
              )}

              <div className="qr-sticker" aria-hidden="true">
                <svg className="qr-sticker__ring" viewBox="0 0 100 100">
                  <defs>
                    <path
                      id="qr-sticker-path"
                      d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0"
                    />
                  </defs>
                  <text>
                    <textPath href="#qr-sticker-path">
                      ESCANEAME · HACÉ RUIDO · ESCANEAME ·
                    </textPath>
                  </text>
                </svg>
                <StarIcon className="qr-sticker__star" />
              </div>

              {previewLoading && (
                <span className="qr-stage__loading" role="status">
                  Generando…
                </span>
              )}
            </div>

            <div className="qr-preview__readout">
              <div>
                <span>Tamaño</span>
                <strong>
                  {size} × {size}
                </strong>
              </div>
              <div>
                <span>Tinta</span>
                <strong>{selectedColor.name}</strong>
              </div>
              <div>
                <span>Formatos</span>
                <strong>PNG + SVG</strong>
              </div>
            </div>

            <div className="downloads">
              <button
                className="download download--png"
                type="button"
                onClick={() => handleDownload('png')}
                disabled={downloadsDisabled}
              >
                <span className="download__icon">
                  <DownloadIcon />
                </span>
                <span className="download__copy">
                  <span>{downloadState === 'png' ? 'Preparando…' : 'Descargar'}</span>
                  <strong>PNG</strong>
                </span>
                <span className="download__meta">{size}px</span>
              </button>

              <button
                className="download download--svg"
                type="button"
                onClick={() => handleDownload('svg')}
                disabled={downloadsDisabled}
              >
                <span className="download__icon">
                  <DownloadIcon />
                </span>
                <span className="download__copy">
                  <span>{downloadState === 'svg' ? 'Preparando…' : 'Descargar'}</span>
                  <strong>SVG</strong>
                </span>
                <span className="download__meta">Vector</span>
              </button>
            </div>

            <p className="qr-preview__note">
              <ArrowDownIcon />
              Tu link no sale del navegador. El SVG escala hasta el infinito.
            </p>
          </aside>
        </div>
      </div>

      {toast && (
        <div
          className={`toast${toast.tone === 'error' ? ' toast--error' : ''}`}
          role={toast.tone === 'error' ? 'alert' : 'status'}
          key={toast.id}
        >
          <span className="toast__icon">
            {toast.tone === 'error' ? '!' : <CheckIcon />}
          </span>
          <span className="toast__copy">
            <strong>{toast.tone === 'error' ? 'Ups' : 'Listo'}</strong>
            {toast.message}
          </span>
        </div>
      )}
    </section>
  )
}
