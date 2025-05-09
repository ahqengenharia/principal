export const ASSETS = {
  MAIN_LOGO: '/assets/images/templates/LOGOAHQ.png',
  PLANT_IMAGES: {
    PLANT1: '/assets/images/templates/imagem usina 1a.png',
  }
};

export const getAssetUrl = (path: string) => {
  return `http://localhost:8080/ahq${path}`;
};