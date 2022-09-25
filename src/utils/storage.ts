export const getStorage = (key: string) => {
  try {
    return key && JSON.parse(localStorage.getItem(key));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return null;
  }
};
export const setStorage = (key: string, val: any) => {
  localStorage.setItem(key, JSON.stringify(val));
};
export const removeStorage = (key: string) => {
  localStorage.removeItem(key);
};
