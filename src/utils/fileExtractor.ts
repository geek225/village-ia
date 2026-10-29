/**
 * Extracteur universel de contenu documentaire et visuel (100% client-side, sans serveur tiers)
 * - PDF : décompression des flux FlateDecode + décodage des opérateurs texte PDF (Tj, TJ, ', ") + UTF-16BE / PDFDocEncoding
 * - DOCX : décompression ZIP native (DecompressionStream) de word/document.xml et extraction des paragraphes <w:t>
 * - Texte / Code / CSV / JSON / Markdown / XML / HTML : lecture UTF-8 directe
 * - Images : redimensionnement haute fidélité sur Canvas (pour envoi multimodal rapide) + profilage visuel (dimensions, couleurs dominantes, luminosité)
 */

export interface ImageVisualProfile {
  dataUrl: string
  width: number
  height: number
  aspectRatio: string
  dominantColors: string[]
  brightnessLabel: string
  summaryText: string
}

/**
 * Décompresse un flux binaire Deflate / Zlib via l'API Web DecompressionStream
 */
async function inflateBytes(compressed: Uint8Array, format: 'deflate' | 'deflate-raw'): Promise<Uint8Array | null> {
  if (typeof DecompressionStream === 'undefined') return null
  try {
    const ds = new DecompressionStream(format)
    const writer = ds.writable.getWriter()
    writer.write(compressed as unknown as BufferSource)
    writer.close()

    const reader = ds.readable.getReader()
    const chunks: Uint8Array[] = []
    let totalLen = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) {
        chunks.push(value)
        totalLen += value.length
      }
    }
    const output = new Uint8Array(totalLen)
    let offset = 0
    for (const c of chunks) {
      output.set(c, offset)
      offset += c.length
    }
    return output
  } catch {
    return null
  }
}

/**
 * Décode une chaîne littérale PDF (gère les séquences d'échappement \n, \r, \t, \(, \), et les octaux \ddd)
 */
function decodePdfLiteralString(raw: string): string {
  let out = ''
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i]
    if (ch === '\\' && i + 1 < raw.length) {
      const next = raw[i + 1]
      if (next === 'n') {
        out += '\n'
        i++
      } else if (next === 'r') {
        out += ' '
        i++
      } else if (next === 't') {
        out += ' '
        i++
      } else if (next === '(' || next === ')' || next === '\\') {
        out += next
        i++
      } else if (next >= '0' && next <= '7') {
        const octal = raw.slice(i + 1, i + 4).match(/^[0-7]{1,3}/)?.[0] || next
        out += String.fromCharCode(parseInt(octal, 8))
        i += octal.length
      } else {
        out += next
        i++
      }
    } else {
      out += ch
    }
  }
  return out
}

/**
 * Décode une chaîne hexadécimale PDF <...> (UTF-16BE si BOM FEFF, sinon Latin1/WinAnsi)
 */
function decodePdfHexString(hex: string): string {
  const clean = hex.replace(/\s+/g, '')
  if (clean.length === 0) return ''
  const bytes: number[] = []
  for (let i = 0; i < clean.length; i += 2) {
    const byte = parseInt(clean.slice(i, i + 2).padEnd(2, '0'), 16)
    if (!Number.isNaN(byte)) bytes.push(byte)
  }
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    let u16 = ''
    for (let i = 2; i + 1 < bytes.length; i += 2) {
      const code = (bytes[i] << 8) | bytes[i + 1]
      if (code >= 32 || code === 10 || code === 9) {
        u16 += String.fromCharCode(code)
      }
    }
    return u16
  }
  return bytes
    .filter(b => b >= 32 || b === 10 || b === 9)
    .map(b => String.fromCharCode(b))
    .join('')
}

/**
 * Extrait les segments de texte d'un flux d'opérateurs de contenu PDF (BT ... ET, Tj, TJ)
 */
function extractTextFromPdfContentStream(content: string): string[] {
  const fragments: string[] = []

  // 1. Tableaux TJ : [(texte) -20 (suite) <0041>] TJ
  const tjArrayRegex = /\[((?:[^[\]]|\([^)]*\)|<[^>]*>)*)\]\s*TJ/g
  let match: RegExpExecArray | null
  while ((match = tjArrayRegex.exec(content)) !== null) {
    const inner = match[1]
    const tokenRegex = /\(((?:\\.|[^\\()])*)\)|<([0-9A-Fa-f\s]+)>/g
    let tok: RegExpExecArray | null
    let line = ''
    while ((tok = tokenRegex.exec(inner)) !== null) {
      if (tok[1] !== undefined) {
        line += decodePdfLiteralString(tok[1])
      } else if (tok[2] !== undefined) {
        line += decodePdfHexString(tok[2])
      }
    }
    if (line.trim()) fragments.push(line.trim())
  }

  // 2. Opérateurs simples : (texte) Tj ou <hex> Tj
  const tjSingleRegex = /(?:\(((?:\\.|[^\\()])*)\)|<([0-9A-Fa-f\s]+)>)\s*(?:Tj|'|")/g
  while ((match = tjSingleRegex.exec(content)) !== null) {
    const decoded =
      match[1] !== undefined
        ? decodePdfLiteralString(match[1])
        : match[2] !== undefined
        ? decodePdfHexString(match[2])
        : ''
    if (decoded.trim()) fragments.push(decoded.trim())
  }

  return fragments
}

/**
 * Extrait le texte complet d'un fichier PDF directement dans le navigateur
 */
export async function extractPdfText(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  const latin1Decoder = new TextDecoder('latin1')
  const rawPdf = latin1Decoder.decode(bytes)

  const extractedChunks: string[] = []

  // Parcourir tous les blocs stream ... endstream du PDF
  let searchPos = 0
  while (searchPos < rawPdf.length) {
    const streamIdx = rawPdf.indexOf('stream', searchPos)
    if (streamIdx === -1) break

    // Vérifier qu'il ne s'agit pas de "endstream"
    if (streamIdx >= 3 && rawPdf.slice(streamIdx - 3, streamIdx) === 'end') {
      searchPos = streamIdx + 6
      continue
    }

    let dataStart = streamIdx + 6
    if (rawPdf[dataStart] === '\r' && rawPdf[dataStart + 1] === '\n') {
      dataStart += 2
    } else if (rawPdf[dataStart] === '\n' || rawPdf[dataStart] === '\r') {
      dataStart += 1
    } else {
      searchPos = streamIdx + 6
      continue
    }

    const endStreamIdx = rawPdf.indexOf('endstream', dataStart)
    if (endStreamIdx === -1) break

    let dataEnd = endStreamIdx
    if (rawPdf[dataEnd - 2] === '\r' && rawPdf[dataEnd - 1] === '\n') {
      dataEnd -= 2
    } else if (rawPdf[dataEnd - 1] === '\n' || rawPdf[dataEnd - 1] === '\r') {
      dataEnd -= 1
    }

    const streamBytes = bytes.subarray(dataStart, dataEnd)
    const headerSlice = rawPdf.slice(Math.max(0, streamIdx - 320), streamIdx)
    const isFlate = /\/FlateDecode\b/.test(headerSlice)

    let decodedStreamText = ''
    if (isFlate && streamBytes.length > 2) {
      const inflated =
        (await inflateBytes(streamBytes, 'deflate')) ||
        (await inflateBytes(streamBytes.subarray(2), 'deflate-raw'))
      if (inflated) {
        decodedStreamText = latin1Decoder.decode(inflated)
      }
    } else {
      decodedStreamText = rawPdf.slice(dataStart, dataEnd)
    }

    if (decodedStreamText && (decodedStreamText.includes('Tj') || decodedStreamText.includes('TJ'))) {
      const parts = extractTextFromPdfContentStream(decodedStreamText)
      if (parts.length > 0) {
        extractedChunks.push(parts.join(' '))
      }
    }

    searchPos = endStreamIdx + 9
  }

  const combined = extractedChunks
    .join('\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  if (combined.length > 20) {
    return combined
  }

  // Repli sur chaînes lisibles présentes dans le PDF (métadonnées / titres / texte non compressé)
  const fallbackMatches = rawPdf.match(/\(([A-Za-zÀ-ÿ0-9 ,.;:'"?!()-]{4,})\)/g)
  if (fallbackMatches && fallbackMatches.length > 0) {
    return fallbackMatches
      .map(m => decodePdfLiteralString(m.slice(1, -1)))
      .join(' ')
      .trim()
  }

  return `[Document PDF : ${file.name} (${Math.round(file.size / 1024)} Ko) — PDF scanné ou composé d'images sans calque texte intégré.]`
}

/**
 * Extrait le texte d'un fichier Word (.docx) en décompressant l'archive ZIP word/document.xml
 */
export async function extractDocxText(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer()
    const view = new DataView(buffer)
    const bytes = new Uint8Array(buffer)
    const utf8 = new TextDecoder('utf-8')

    let offset = 0
    while (offset + 30 < bytes.length) {
      // Signature Local File Header PK\x03\x04
      if (view.getUint32(offset, true) !== 0x04034b50) break

      const compression = view.getUint16(offset + 8, true)
      const compressedSize = view.getUint32(offset + 18, true)
      const fileNameLen = view.getUint16(offset + 26, true)
      const extraLen = view.getUint16(offset + 28, true)

      const fileName = utf8.decode(bytes.subarray(offset + 30, offset + 30 + fileNameLen))
      const dataStart = offset + 30 + fileNameLen + extraLen
      const dataEnd = dataStart + compressedSize

      if (fileName === 'word/document.xml' && dataEnd <= bytes.length) {
        const entryBytes = bytes.subarray(dataStart, dataEnd)
        let xmlText = ''
        if (compression === 0) {
          xmlText = utf8.decode(entryBytes)
        } else if (compression === 8) {
          const inflated = await inflateBytes(entryBytes, 'deflate-raw')
          if (inflated) {
            xmlText = utf8.decode(inflated)
          }
        }
        if (xmlText) {
          return xmlText
            .replace(/<\/w:p>/g, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/\n{3,}/g, '\n\n')
            .trim()
        }
      }
      offset = dataEnd
    }
  } catch {
    // Fallback
  }
  return `[Document Word : ${file.name} (${Math.round(file.size / 1024)} Ko)]`
}

/**
 * Redimensionne une image (max 1280px) pour un envoi multimodal rapide et génère son profil visuel
 */
export async function processImageForVision(file: File): Promise<ImageVisualProfile> {
  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  return new Promise<ImageVisualProfile>(resolve => {
    const img = new Image()
    img.onload = () => {
      const origW = img.naturalWidth || img.width || 1
      const origH = img.naturalHeight || img.height || 1
      const maxDim = 1280
      const scale = Math.min(1, maxDim / Math.max(origW, origH))
      const targetW = Math.max(1, Math.round(origW * scale))
      const targetH = Math.max(1, Math.round(origH * scale))

      const canvas = document.createElement('canvas')
      canvas.width = targetW
      canvas.height = targetH
      const ctx = canvas.getContext('2d')

      let optimizedDataUrl = rawDataUrl
      const dominantColors: string[] = []
      let brightnessLabel = 'Équilibrée'

      if (ctx) {
        ctx.drawImage(img, 0, 0, targetW, targetH)
        try {
          optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.86)
        } catch {
          optimizedDataUrl = rawDataUrl
        }

        // Échantillonnage de la grille de pixels pour extraire la luminosité et la palette dominante
        try {
          const sampleSize = 24
          const sampleCanvas = document.createElement('canvas')
          sampleCanvas.width = sampleSize
          sampleCanvas.height = sampleSize
          const sCtx = sampleCanvas.getContext('2d')
          if (sCtx) {
            sCtx.drawImage(img, 0, 0, sampleSize, sampleSize)
            const { data } = sCtx.getImageData(0, 0, sampleSize, sampleSize)
            let lumSum = 0
            const colorBuckets = new Map<string, number>()

            for (let i = 0; i < data.length; i += 4) {
              const r = data[i]
              const g = data[i + 1]
              const b = data[i + 2]
              lumSum += 0.299 * r + 0.587 * g + 0.114 * b

              // Quantification douce pour regrouper les teintes proches
              const qr = Math.min(255, Math.round(r / 32) * 32)
              const qg = Math.min(255, Math.round(g / 32) * 32)
              const qb = Math.min(255, Math.round(b / 32) * 32)
              const hex = `#${qr.toString(16).padStart(2, '0')}${qg.toString(16).padStart(2, '0')}${qb.toString(16).padStart(2, '0')}`
              colorBuckets.set(hex, (colorBuckets.get(hex) || 0) + 1)
            }

            const avgLum = lumSum / (sampleSize * sampleSize)
            brightnessLabel = avgLum > 185 ? 'Claire / Haute luminosité' : avgLum < 75 ? 'Sombre / Contrastée' : 'Luminosité équilibrée'

            const sortedColors = [...colorBuckets.entries()]
              .sort((a, b) => b[1] - a[1])
              .slice(0, 4)
              .map(([hex]) => hex.toUpperCase())
            dominantColors.push(...sortedColors)
          }
        } catch {
          // Ignore canvas taint if any
        }
      }

      const ratio = (origW / origH).toFixed(2)
      const orientation = origW > origH * 1.15 ? 'Paysage' : origH > origW * 1.15 ? 'Portrait' : 'Carré'
      const summaryText = `Image "${file.name}" (${origW}×${origH}px, format ${orientation}, ratio ${ratio}, ${Math.round(file.size / 1024)} Ko, ${brightnessLabel}, teintes dominantes : ${dominantColors.join(', ') || 'N/A'})`

      resolve({
        dataUrl: optimizedDataUrl,
        width: origW,
        height: origH,
        aspectRatio: `${orientation} (${origW}×${origH}px)`,
        dominantColors,
        brightnessLabel,
        summaryText,
      })
    }
    img.onerror = () => {
      resolve({
        dataUrl: rawDataUrl,
        width: 0,
        height: 0,
        aspectRatio: 'Standard',
        dominantColors: [],
        brightnessLabel: 'Standard',
        summaryText: `Image "${file.name}" (${Math.round(file.size / 1024)} Ko)`,
      })
    }
    img.src = rawDataUrl
  })
}

