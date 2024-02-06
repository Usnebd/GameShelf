interface MenuItem {
  name: string;
  src: string;
}

export interface MenuData {
  Antipasti: MenuItem[];
  Primi: MenuItem[];
  Secondi: MenuItem[];
  Desserts: MenuItem[];
  Bevande: MenuItem[];
  [key: string]: MenuItem[];
}

export default async function getMenuData(filePath: string) {
  try {
    // Usa l'importazione di moduli ES6 al posto di require
    const response = await fetch(filePath);
    const jsonData: MenuData = await response.json();
    // Controlla che il dato letto sia un oggetto
    if (typeof jsonData === "object" && jsonData !== null) {
      // Fai il casting esplicito al tipo definito
      const menuData: MenuData = jsonData as MenuData;
      return menuData;
    } else {
      console.error("Il file JSON non contiene un oggetto valido.");
      return null;
    }
  } catch (error) {
    console.error("Errore nella lettura del file JSON:", error);
    return null;
  }
}
