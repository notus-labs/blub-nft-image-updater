export const useIsiOS = () => {
  return (
    /iPad/i.test(navigator.userAgent) ||
    /iPhone/i.test(navigator.userAgent) ||
    /iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
};
