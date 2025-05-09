export type DeviceType = 'mobile' | 'desktop';
export type OSType = 'android' | 'ios' | 'windows' | 'linux' | 'macos' | 'unknown';

export const detectSystem = (): { deviceType: DeviceType; osType: OSType } => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Detect if mobile
  const isMobile = /iphone|ipad|ipod|android|blackberry|windows phone/g.test(userAgent);
  
  // Detect OS
  let osType: OSType = 'unknown';
  if (/android/i.test(userAgent)) {
    osType = 'android';
  } else if (/iphone|ipad|ipod/i.test(userAgent)) {
    osType = 'ios';
  } else if (/windows/i.test(userAgent)) {
    osType = 'windows';
  } else if (/macintosh|mac os x/i.test(userAgent)) {
    osType = 'macos';
  } else if (/linux/i.test(userAgent)) {
    osType = 'linux';
  }

  return {
    deviceType: isMobile ? 'mobile' : 'desktop',
    osType
  };
};