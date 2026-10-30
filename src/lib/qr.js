import QRCode from 'qrcode'

export const MAX_LOGO_BYTES = 4 * 1024 * 1024

const LOGO_BOX_RATIO = 0.25
const LOGO_INNER_RATIO = 0.82

const TYPE_BY_EXTENSION = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  svg: 'image/svg+xml',
}

const TYPE_LABELS = {
  'image/png': 'PNG',
  'image/jpg': 'JPG',
  'image/jpeg': 'JPG',
  'image/svg+xml': 'SVG',
}

function getLogoType(file) {
  const extension = file.name.split('.').pop()?.toLowerCase()
  const extensionType = TYPE_BY_EXTENSION[extension]

  if (file.type && file.type !== 'application/octet-stream') {
    return TYPE_LABELS[file.type] ? file.type : null
  }

  return extensionType || null
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('No pudimos leer la imagen. Probá de nuevo.'))
    reader.readAsDataURL(file)
  })
}

function setDataUrlType(dataUrl, type) {
  return dataUrl.replace(/^data:[^;,]*/, `data:${type}`)
}

function svgToDataUrl(svgText) {
  const bytes = new TextEncoder().encode(svgText)
  let binary = ''
  const chunkSize = 0x8000

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize))
  }

  return `data:image/svg+xml;base64,${window.btoa(binary)}`
}

function parseViewBox(value) {
  if (!value) {
    return null
  }

  const parts = value.trim().split(/[\s,]+/).map(Number)

  if (
    parts.length !== 4 ||
    parts.some((part) => !Number.isFinite(part)) ||
    parts[2] <= 0 ||
    parts[3] <= 0
  ) {
    return null
  }

  return { width: parts[2], height: parts[3] }
}

function parseAbsoluteLength(value) {
  if (!value || !/^\d*\.?\d+(?:px)?$/i.test(value.trim())) {
    return null
  }

  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function normalizeSvg(svgText, fallbackSrc) {
  const document = new DOMParser().parseFromString(svgText, 'image/svg+xml')

  if (document.querySelector('parsererror')) {
    return { src: fallbackSrc, aspectRatio: null }
  }

  const root = document.documentElement

  if (!root || root.localName !== 'svg') {
    return { src: fallbackSrc, aspectRatio: null }
  }

  root.querySelectorAll('script, foreignObject').forEach((node) => node.remove())

  for (const node of [root, ...root.querySelectorAll('*')]) {
    for (const attribute of Array.from(node.attributes)) {
      const name = attribute.name.toLowerCase()

      if (name.startsWith('on')) {
        node.removeAttribute(attribute.name)
      } else if (
        attribute.localName === 'href' &&
        /^\s*javascript:/i.test(attribute.value)
      ) {
        node.removeAttribute(attribute.name)
      }
    }
  }

  const viewBox = parseViewBox(root.getAttribute('viewBox'))
  let width = parseAbsoluteLength(root.getAttribute('width'))
  let height = parseAbsoluteLength(root.getAttribute('height'))

  if (viewBox) {
    if (!width && !height) {
      width = viewBox.width
      height = viewBox.height
    } else if (!width) {
      width = height * (viewBox.width / viewBox.height)
    } else if (!height) {
      height = width / (viewBox.width / viewBox.height)
    }

    if (width) {
      root.setAttribute('width', String(Number(width.toFixed(2))))
    }

    if (height) {
      root.setAttribute('height', String(Number(height.toFixed(2))))
    }
  }

  if (!root.getAttribute('xmlns')) {
    root.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  }

  const serialized = new XMLSerializer().serializeToString(root)
  const aspectRatio =
    width && height ? width / height : viewBox ? viewBox.width / viewBox.height : null

  return { src: svgToDataUrl(serialized), aspectRatio }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('La imagen no se pudo interpretar.'))
    image.src = src
  })
}

export async function readLogoFile(file) {
  const detectedType = getLogoType(file)

  if (!detectedType) {
    throw new Error('Formato no compatible. Usá PNG, JPG, JPEG o SVG.')
  }

  if (file.size > MAX_LOGO_BYTES) {
    throw new Error(
      `La imagen supera los ${Math.round(MAX_LOGO_BYTES / (1024 * 1024))} MB. Probá con una más liviana.`,
    )
  }

  const type = detectedType === 'image/jpg' ? 'image/jpeg' : detectedType

  const [rawSrc, svgText] = await Promise.all([
    readFileAsDataUrl(file),
    type === 'image/svg+xml' ? file.text() : null,
  ])
  const rawTypedSrc = setDataUrlType(rawSrc, type)

  const normalized = svgText
    ? normalizeSvg(svgText, rawTypedSrc)
    : { src: rawTypedSrc, aspectRatio: null }

  const image = await loadImage(normalized.src)
  const naturalRatio =
    image.naturalWidth > 0 && image.naturalHeight > 0
      ? image.naturalWidth / image.naturalHeight
      : null

  return {
    name: file.name || 'logo',
    src: normalized.src,
    type,
    typeLabel: TYPE_LABELS[type],
    size: file.size,
    aspectRatio: naturalRatio || normalized.aspectRatio || 1,
  }
}

export function formatFileSize(bytes) {
  if (!bytes) {
    return ''
  }

  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function drawLogoOnCanvas(context, width, logoImage, logo) {
  const boxSize = width * LOGO_BOX_RATIO
  const innerSize = boxSize * LOGO_INNER_RATIO
  const boxX = (width - boxSize) / 2
  const boxY = (width - boxSize) / 2

  context.fillStyle = '#ffffff'
  context.fillRect(boxX, boxY, boxSize, boxSize)

  const naturalRatio =
    logoImage.naturalWidth > 0 && logoImage.naturalHeight > 0
      ? logoImage.naturalWidth / logoImage.naturalHeight
      : null
  const aspectRatio = naturalRatio || logo.aspectRatio || 1
  let logoWidth = innerSize
  let logoHeight = innerSize

  if (aspectRatio >= 1) {
    logoHeight = innerSize / aspectRatio
  } else {
    logoWidth = innerSize * aspectRatio
  }

  context.drawImage(
    logoImage,
    boxX + (boxSize - logoWidth) / 2,
    boxY + (boxSize - logoHeight) / 2,
    logoWidth,
    logoHeight,
  )
}

export async function makeQrPng(url, options, logo) {
  const qrDataUrl = await QRCode.toDataURL(url, options)

  if (!logo) {
    return qrDataUrl
  }

  const [qrImage, logoImage] = await Promise.all([
    loadImage(qrDataUrl),
    loadImage(logo.src),
  ])
  const canvas = document.createElement('canvas')
  canvas.width = options.width
  canvas.height = options.width
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('No pudimos preparar el lienzo del QR.')
  }

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(qrImage, 0, 0, options.width, options.width)
  drawLogoOnCanvas(context, options.width, logoImage, logo)

  return canvas.toDataURL('image/png')
}

function formatSvgNumber(value) {
  return Number(value.toFixed(3))
}

function addLogoToSvg(svgMarkup, logo) {
  const match = svgMarkup.match(/viewBox="([^"]+)"/)

  if (!match) {
    return svgMarkup
  }

  const values = match[1].trim().split(/[\s,]+/).map(Number)

  if (values.length !== 4 || values.some((value) => !Number.isFinite(value))) {
    return svgMarkup
  }

  const [viewX, viewY, viewWidth, viewHeight] = values
  const boxSize = Math.min(viewWidth, viewHeight) * LOGO_BOX_RATIO
  const innerSize = boxSize * LOGO_INNER_RATIO
  const boxX = viewX + (viewWidth - boxSize) / 2
  const boxY = viewY + (viewHeight - boxSize) / 2
  const innerX = boxX + (boxSize - innerSize) / 2
  const innerY = boxY + (boxSize - innerSize) / 2

  const overlay = [
    `<rect x="${formatSvgNumber(boxX)}" y="${formatSvgNumber(boxY)}" width="${formatSvgNumber(boxSize)}" height="${formatSvgNumber(boxSize)}" fill="#ffffff"/>`,
    `<image href="${logo.src}" x="${formatSvgNumber(innerX)}" y="${formatSvgNumber(innerY)}" width="${formatSvgNumber(innerSize)}" height="${formatSvgNumber(innerSize)}" preserveAspectRatio="xMidYMid meet" image-rendering="optimizeQuality"/>`,
  ].join('')

  return svgMarkup.replace('</svg>', `${overlay}</svg>`)
}

export async function makeQrSvg(url, options, logo) {
  const svgMarkup = await QRCode.toString(url, {
    ...options,
    type: 'svg',
  })

  return logo ? addLogoToSvg(svgMarkup, logo) : svgMarkup
}
