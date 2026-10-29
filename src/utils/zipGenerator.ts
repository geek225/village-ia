/**
 * Générateur d'archives ZIP autonome (Zero-dependency) conforme à la spécification PKZIP (STORE).
 * Permet d'exporter n'importe quelle application générée en un package ZIP prêt pour Vercel / Netlify.
 */

// Table CRC32 précalculée
const CRC_TABLE = new Uint32Array(256)
for (let i = 0; i < 256; i++) {
  let c = i
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  }
  CRC_TABLE[i] = c
}

function calculateCrc32(data: Uint8Array): number {
  let crc = 0xffffffff
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ data[i]) & 0xff]
  }
  return (crc ^ 0xffffffff) >>> 0
}

export interface ZipFileInput {
  name: string
  content: string | Uint8Array
}

export function createZipArchive(files: ZipFileInput[]): Uint8Array {
  const encoder = new TextEncoder()
  const localHeaders: Uint8Array[] = []
  const centralHeaders: Uint8Array[] = []

  let currentOffset = 0

  files.forEach(file => {
    const filenameBytes = encoder.encode(file.name)
    const dataBytes = typeof file.content === 'string' ? encoder.encode(file.content) : file.content
    const crc = calculateCrc32(dataBytes)
    const size = dataBytes.length

    // 1. Local File Header (30 octets + nom + data)
    const localHeader = new Uint8Array(30 + filenameBytes.length + size)
    const lView = new DataView(localHeader.buffer)

    lView.setUint32(0, 0x04034b50, true) // Signature Local File Header
    lView.setUint16(4, 20, true)         // Version needed (2.0)
    lView.setUint16(6, 0x0800, true)     // General purpose flag (UTF-8 filename)
    lView.setUint16(8, 0, true)          // Compression method (0 = STORE)
    lView.setUint16(10, 0x52c0, true)    // File time
    lView.setUint16(12, 0x589d, true)    // File date
    lView.setUint32(14, crc, true)       // CRC32
    lView.setUint32(18, size, true)      // Compressed size
    lView.setUint32(22, size, true)      // Uncompressed size
    lView.setUint16(26, filenameBytes.length, true) // Filename length
    lView.setUint16(28, 0, true)         // Extra field length

    localHeader.set(filenameBytes, 30)
    localHeader.set(dataBytes, 30 + filenameBytes.length)

    localHeaders.push(localHeader)

    // 2. Central Directory File Header (46 octets + nom)
    const centralHeader = new Uint8Array(46 + filenameBytes.length)
    const cView = new DataView(centralHeader.buffer)

    cView.setUint32(0, 0x02014b50, true) // Signature Central Directory
    cView.setUint16(4, 20, true)         // Version made by
    cView.setUint16(6, 20, true)         // Version needed
    cView.setUint16(8, 0x0800, true)     // General purpose flag (UTF-8)
    cView.setUint16(10, 0, true)         // Compression (STORE)
    cView.setUint16(12, 0x52c0, true)    // Time
    cView.setUint16(14, 0x589d, true)    // Date
    cView.setUint32(16, crc, true)       // CRC32
    cView.setUint32(20, size, true)      // Compressed size
    cView.setUint32(24, size, true)      // Uncompressed size
    cView.setUint16(28, filenameBytes.length, true) // Filename length
    cView.setUint16(30, 0, true)         // Extra field length
    cView.setUint16(32, 0, true)         // Comment length
    cView.setUint16(34, 0, true)         // Disk start
    cView.setUint16(36, 0, true)         // Internal file attributes
    cView.setUint32(38, 0, true)         // External file attributes
    cView.setUint32(42, currentOffset, true) // Relative offset of local header

    centralHeader.set(filenameBytes, 46)
    centralHeaders.push(centralHeader)

    currentOffset += localHeader.length
  })

  // Calcul des tailles globales
  const centralDirOffset = currentOffset
  const centralDirSize = centralHeaders.reduce((acc, h) => acc + h.length, 0)

  // 3. End of Central Directory Record (22 octets)
  const eocd = new Uint8Array(22)
  const eView = new DataView(eocd.buffer)

  eView.setUint32(0, 0x06054b50, true) // Signature EOCD
  eView.setUint16(4, 0, true)          // Disk number
  eView.setUint16(6, 0, true)          // Disk with central dir
  eView.setUint16(8, files.length, true)  // Entries on disk
  eView.setUint16(10, files.length, true) // Total entries
  eView.setUint32(12, centralDirSize, true)   // Size of central directory
  eView.setUint32(16, centralDirOffset, true) // Offset of central directory
  eView.setUint16(20, 0, true)         // ZIP comment length

  // Concaténation de l'ensemble du binaire ZIP
  const totalLength = currentOffset + centralDirSize + eocd.length
  const result = new Uint8Array(totalLength)

  let writePos = 0
  localHeaders.forEach(lh => {
    result.set(lh, writePos)
    writePos += lh.length
  })
  centralHeaders.forEach(ch => {
    result.set(ch, writePos)
    writePos += ch.length
  })
  result.set(eocd, writePos)

  return result
}

export function downloadZip(filename: string, files: ZipFileInput[]): void {
  const zipBytes = createZipArchive(files)
  const blob = new Blob([zipBytes], { type: 'application/zip' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.zip') ? filename : `${filename}.zip`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

