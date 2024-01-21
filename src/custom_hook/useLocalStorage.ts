export const useLocalStorage = (key: string) => {
  const setItem = (value: unknown) => {
    try {
      const serializedValue = JSON.stringify(value);
      window.localStorage.setItem(key, serializedValue);
      return JSON.parse(serializedValue);
    } catch (error) {
      console.log(error);
    }
  };
  const getItem = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : undefined;
    } catch (error) {
      console.log(error);
    }
  };
  return { setItem, getItem };
};
