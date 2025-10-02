/**
 * Custom validators for file upload components
 */

export function registerValidators() {
  return {
    fileSize: fileSizeValidator,
    fileType: fileTypeValidator,
    virusScan: virusScanValidator,
    imageResolution: imageResolutionValidator
  };
}

/**
 * Validate file size
 */
function fileSizeValidator(context: any) {
  const { component, value } = context;

  if (!value) return true;

  const files = Array.isArray(value) ? value : [value];
  const maxSize = parseFileSize(component.fileMaxSize);
  const minSize = parseFileSize(component.fileMinSize);

  for (const file of files) {
    if (maxSize && file.size > maxSize) {
      return `File ${file.name} exceeds maximum size of ${component.fileMaxSize}`;
    }
    if (minSize && file.size < minSize) {
      return `File ${file.name} is smaller than minimum size of ${component.fileMinSize}`;
    }
  }

  return true;
}

/**
 * Validate file type
 */
function fileTypeValidator(context: any) {
  const { component, value } = context;

  if (!value || !component.filePattern || component.filePattern === '*') {
    return true;
  }

  const files = Array.isArray(value) ? value : [value];
  const allowedTypes = parseFilePattern(component.filePattern);

  for (const file of files) {
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const fileMime = file.type;

    let isAllowed = false;
    for (const pattern of allowedTypes) {
      if (pattern.startsWith('.') && fileExt === pattern) {
        isAllowed = true;
        break;
      }
      if (pattern.includes('/') && fileMime.match(new RegExp(pattern.replace('*', '.*')))) {
        isAllowed = true;
        break;
      }
    }

    if (!isAllowed) {
      return `File type ${fileExt} is not allowed. Allowed types: ${component.filePattern}`;
    }
  }

  return true;
}

/**
 * Validate virus scan (placeholder - requires server-side implementation)
 */
async function virusScanValidator(context: any) {
  const { component, value } = context;

  if (!value || !component.virusScan) {
    return true;
  }

  // This would need to call a server-side virus scanning API
  // For now, we'll just return true
  console.log('Virus scan validation would be performed server-side');

  return true;
}

/**
 * Validate image resolution
 */
function imageResolutionValidator(context: any) {
  const { component, value } = context;

  if (!value || !component.imageMinResolution && !component.imageMaxResolution) {
    return true;
  }

  const files = Array.isArray(value) ? value : [value];

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      continue;
    }

    // This would need to load the image and check dimensions
    // For now, we'll skip this validation
    console.log('Image resolution validation would be performed client-side');
  }

  return true;
}

/**
 * Helper function to parse file size strings
 */
function parseFileSize(size: string): number | null {
  if (!size) return null;

  const units: Record<string, number> = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024,
    'TB': 1024 * 1024 * 1024 * 1024
  };

  const match = size.match(/^(\d+(?:\.\d+)?)\s*([KMGT]?B)$/i);
  if (!match) return null;

  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();

  return value * (units[unit] || 1);
}

/**
 * Helper function to parse file patterns
 */
function parseFilePattern(pattern: string): string[] {
  if (!pattern || pattern === '*') return ['*'];

  return pattern.split(',').map(p => p.trim());
}