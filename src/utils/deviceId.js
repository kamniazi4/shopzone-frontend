// Generates (or retrieves) a persistent device identifier stored in localStorage.
// This id is unique per browser/device and never changes unless local storage
// is cleared, which is what makes the cart "device-specific".
const DEVICE_ID_KEY = 'shopzone_device_id';

function generateDeviceId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'device-' + Date.now() + '-' + Math.random().toString(36).slice(2);
}

export function getDeviceId() {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}