export const FILE_EXTENSION_TO_CONTENT_TYPE_MAP = {
  // Images
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  bmp: 'image/bmp',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  ico: 'image/x-icon',

  // Audio
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  mid: 'audio/midi',

  // Video
  mp4: 'video/mp4',
  avi: 'video/x-msvideo',
  mpeg: 'video/mpeg',
  mov: 'video/quicktime',
  webm: 'video/webm',

  // Text
  txt: 'text/plain',
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  json: 'application/json',
  xml: 'application/xml',

  // Documents
  epub: 'application/epub+zip',
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

  // Data
  csv: 'text/csv',
  tsv: 'text/tab-separated-values',
  zip: 'application/zip',
  gzip: 'application/gzip'
}

export const getContentTypeByFileExtension = (extension: string) => {
  return FILE_EXTENSION_TO_CONTENT_TYPE_MAP[(extension ?? '').toLowerCase() as keyof typeof FILE_EXTENSION_TO_CONTENT_TYPE_MAP] || 'application/octet-stream'
}
