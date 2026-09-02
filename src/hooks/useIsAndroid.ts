export const useIsAndroid = () => {
  return /android/i.test(navigator.userAgent);
};
