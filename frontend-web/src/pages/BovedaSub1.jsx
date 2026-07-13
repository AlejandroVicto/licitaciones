import React from 'react';
import BovedaModulo from '../components/BovedaModulo';

const docs = [
  "Acta_Constitutiva_y_Modificaciones",
  "INE_Administrador_Unico",
  "INE_Representante_Legal",
  "Comprobante_Domicilio_Administrador",
  "Comprobante_Domicilio_Representante_Legal",
  "Poder_Notarial",
  "Constancia_Situacion_Fiscal_SAT",
  "Opinion_Cumplimiento_32D_SAT",
  "Opinion_Cumplimiento_IMSS",
  "Constancia_Situacion_Fiscal_INFONAVIT",
  "Constancia_No_Adeudo_Estatal",
  "Padron_Contratistas_Estatal",
  "Constancia_No_Inhabilitacion",
  "Identificacion_Patronal_IMSS",
  "Padron_Contratistas_SHTFP"
];

const BovedaSub1 = () => (
  <BovedaModulo titulo="Módulo 1: Legal y Acreditación" documentosPermitidos={docs} />
);

export default BovedaSub1;
