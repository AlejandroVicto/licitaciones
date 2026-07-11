const API_URL = 'http://127.0.0.1:8000';

export const getEmpresas = async () => {
  const response = await fetch(`${API_URL}/empresas`);
  if (!response.ok) throw new Error('Error al obtener empresas');
  return response.json();
};

export const crearEmpresa = async (data) => {
  const response = await fetch(`${API_URL}/empresas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al crear empresa');
  return response.json();
};

export const descargarMachote = async (empresaId) => {
  const response = await fetch(`${API_URL}/empresas/${empresaId}/generar-documento`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Error al generar el documento');
  
  // Intentar obtener el nombre del archivo original
  const contentDisposition = response.headers.get('Content-Disposition');
  let filename = `Machote_Empresa_${empresaId}.docx`;
  if (contentDisposition && contentDisposition.includes('filename=')) {
    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
    if (filenameMatch && filenameMatch.length === 2) {
      filename = filenameMatch[1];
    }
  }

  // Manejo del Blob para la descarga
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export const actualizarEmpresa = async (id, data) => {
  const response = await fetch(`${API_URL}/empresas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al actualizar empresa');
  return response.json();
};

export const getSocios = async (empresaId) => {
  const response = await fetch(`${API_URL}/empresas/${empresaId}/socios`);
  if (!response.ok) throw new Error('Error al obtener socios');
  return response.json();
};

export const agregarSocio = async (empresaId, data) => {
  const response = await fetch(`${API_URL}/empresas/${empresaId}/socios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al agregar socio');
  return response.json();
};

export const eliminarSocio = async (socioId) => {
  const response = await fetch(`${API_URL}/socios/${socioId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error al eliminar socio');
  return response.json();
};

export const getDocumentos = async (empresaId) => {
  const response = await fetch(`${API_URL}/empresas/${empresaId}/documentos`);
  if (!response.ok) throw new Error('Error al obtener documentos');
  return response.json();
};

export const subirDocumento = async (empresaId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_URL}/empresas/${empresaId}/documentos`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Error al subir documento');
  return response.json();
};

export const eliminarDocumento = async (empresaId, fileName) => {
  const response = await fetch(`${API_URL}/empresas/${empresaId}/documentos/${encodeURIComponent(fileName)}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error al eliminar documento');
  return response.json();
};

export const descargarDocumento = async (empresaId, fileName) => {
  const response = await fetch(`${API_URL}/empresas/${empresaId}/documentos/${encodeURIComponent(fileName)}`);
  if (!response.ok) throw new Error('Error al descargar el documento');
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName.split('/').pop();
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};
