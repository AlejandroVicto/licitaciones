import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { getDocumentos, subirDocumento, eliminarDocumento, descargarDocumento } from '../services/api';

const useDocumentosBoveda = (empresaSeleccionada, prefixModulo) => {
  const [archivos, setArchivos] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [uploading, setUploading] = useState(false);

  const cargarArchivos = useCallback(async () => {
    if (!empresaSeleccionada) return;
    try {
      setLoadingList(true);
      const data = await getDocumentos(empresaSeleccionada.id);
      setArchivos(data || []);
    } catch (error) {
      console.error(error);
      message.error('Error al cargar la lista de documentos');
    } finally {
      setLoadingList(false);
    }
  }, [empresaSeleccionada]);

  useEffect(() => {
    cargarArchivos();
  }, [cargarArchivos]);

  const archivosDelModulo = archivos.filter(a => a.name.startsWith(prefixModulo));

  const uploadFiles = async (fileList, customNames, docClean, isMultiple) => {
    if (fileList.length === 0) {
      message.warning('Selecciona un archivo primero');
      return false;
    }
    
    setUploading(true);
    let todosOk = true;
    
    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const ext = file.name.split('.').pop().toLowerCase();
        
        let customSuffix = '';
        if (isMultiple) {
          const userSuffix = customNames[file.uid];
          customSuffix = userSuffix ? `_${userSuffix.replace(/ /g, "_")}` : `_${i+1}`;
        }

        const nuevoNombre = isMultiple
            ? `${docClean}${customSuffix}.${ext}` 
            : `${docClean}.${ext}`;
            
        const renamedFile = new File([file], nuevoNombre, { type: file.type });
        await subirDocumento(empresaSeleccionada.id, renamedFile);
      }
    } catch (error) {
      todosOk = false;
      message.error('Hubo un error al subir los archivos');
    } finally {
      setUploading(false);
      if (todosOk) {
        message.success('Documento(s) subidos correctamente');
        cargarArchivos();
      }
    }
    return todosOk;
  };

  const deleteFile = async (fileName) => {
    try {
      await eliminarDocumento(empresaSeleccionada.id, fileName);
      message.success('Archivo eliminado');
      cargarArchivos();
      return true;
    } catch (error) {
      message.error('Error al eliminar archivo');
      return false;
    }
  };

  const downloadFile = async (fileName) => {
    try {
      await descargarDocumento(empresaSeleccionada.id, fileName);
    } catch (error) {
      message.error('Error al descargar');
    }
  };

  return {
    archivos,
    archivosDelModulo, // fallback logic in BovedaModulo will filter this further if no prefix
    loadingList,
    uploading,
    cargarArchivos,
    uploadFiles,
    deleteFile,
    downloadFile
  };
};

export default useDocumentosBoveda;
