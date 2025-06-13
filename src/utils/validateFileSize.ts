function convertSizeToBytes(size) {
  const units = {
    MB: 1024 * 1024,
    KB: 1024,
    B: 1,
  };

  const unit = size.match(/[a-zA-Z]+/)[0];
  const value = parseFloat(size);

  return value * (units[unit.toUpperCase()] || 1);
}

export function checkBase64FileSize(base64String, maxSize) {
  // Decode the base64 string
  const decodedData = Buffer.from(base64String, 'base64');

  // Get the size of the decoded data
  const sizeInBytes = decodedData.length;

  const maxSizeInBytes = convertSizeToBytes(maxSize);
  // Check if the size exceeds the maximum size
  return sizeInBytes <= maxSizeInBytes;
}
