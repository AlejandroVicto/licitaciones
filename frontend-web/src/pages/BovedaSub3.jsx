import React from 'react';
import BovedaModulo from '../components/BovedaModulo';

const docs = [
  "Declaracion_Anual_Previas - Acuse",
  "Declaracion_Anual_Previas - Declaracion",
  "Declaracion_Anual_Previas - Estado_Financiero",
  "Declaraciones_Provisionales",
  "Estados_Financieros",
  "Expediente_Contador_Publico - Cédula_profesional",
  "Expediente_Contador_Publico - Registro_SAT",
  "Expediente_Contador_Publico - Afiliacion_Colegio",
  "Expediente_Contador_Publico - Identificacion_oficial",
  "Expediente_Contador_Publico - Constancia_situacion_fiscal"
];

const BovedaSub3 = () => (
  <BovedaModulo titulo="Módulo 3: Financiero y Contable" documentosPermitidos={docs} />
);

export default BovedaSub3;
