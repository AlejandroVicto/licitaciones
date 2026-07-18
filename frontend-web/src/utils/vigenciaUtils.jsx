import React from 'react';
import { Tag } from 'antd';

export const obtenerDiasVigencia = (docReq) => {
  const docLower = docReq.toLowerCase();
  if (docLower.includes("constancia_situacion_fiscal")) return 30;
  if (docLower.includes("opinion_cumplimiento_32d_sat")) return 30;
  if (docLower.includes("opinion_cumplimiento_imss")) return 15;
  if (docLower.includes("comprobante_domicilio")) return 90;
  return null;
};

export const calcularEstadoVigencia = (fileItem, docReq) => {
  const diasPermitidos = obtenerDiasVigencia(docReq);
  if (!diasPermitidos) return <Tag color="default">Sin Caducidad</Tag>;

  const fechaSubida = new Date(fileItem.updated_at || fileItem.created_at);
  
  if (isNaN(fechaSubida)) return <Tag color="default">Sin Fecha</Tag>;

  const hoy = new Date();
  const diffTime = hoy - fechaSubida;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
  
  if (diffDays <= diasPermitidos) {
    return <Tag color="success">Vigente</Tag>;
  } else {
    return <Tag color="error">Desactualizado</Tag>;
  }
};
