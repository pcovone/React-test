export const useLocalStorage = () => {
  const writeLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))

    return value
  }

  const readLocalStorage = (key) => {
    const item = localStorage.getItem(key)

    return item ? JSON.parse(item) : null
  }

  return { writeLocalStorage, readLocalStorage }
}
