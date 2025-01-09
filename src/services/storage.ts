export const localStorageHandler = {
  getItem: (key: string): string | undefined => {
    const itemFromStorage = window.localStorage.getItem(key);

    return itemFromStorage === null ? undefined : itemFromStorage;
  },
  removeItem: (key: string): void => {
    window.localStorage.removeItem(key);
  },
  setItem: (key: string, value: string) => {
    window.localStorage.setItem(key, value);
  },
};
