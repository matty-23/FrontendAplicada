export const convertirArchivosABase64 = async (archivos) => {
  return Promise.all(
    archivos.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve({ nombre: file.name, tipo: file.type, contenido: reader.result });
        reader.onerror = (error) => reject(error);
      });
    })
  );
};