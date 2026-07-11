import React from 'react';
import BovedaModulo from '../components/BovedaModulo';

const docs = [
  "Expediente_DRO - Licencia_SIC",
  "Expediente_DRO - Identificacion_oficial",
  "Expediente_DRO - Cedula",
  "Expediente_DRO - Curriculum",
  "Expediente_DRO - Comprobante_domicilio",
  "Expediente_Superintendente - Identificacion_oficial",
  "Expediente_Superintendente - Cedula",
  "Expediente_Superintendente - Curriculum",
  "Expediente_Superintendente - Comprobante_habilidad",
  "Expediente_Superintendente - Comprobante_domicilio",
  "Expediente_Auxiliar_Superintendente - Identificacion_oficial",
  "Expediente_Auxiliar_Superintendente - Cedula",
  "Expediente_Auxiliar_Superintendente - Curriculum",
  "Expediente_Auxiliar_Superintendente - Comprobante_habilidad",
  "Expediente_Auxiliar_Superintendente - Comprobante_domicilio",
  "Expediente_Jefe_Topografia - Identificacion_oficial",
  "Expediente_Jefe_Topografia - Cedula",
  "Expediente_Jefe_Topografia - Curriculum",
  "Expediente_Jefe_Topografia - Comprobante_habilidad",
  "Expediente_Jefe_Topografia - Comprobante_domicilio",
  "Expediente_Jefe_Laboratorio - Identificacion_oficial",
  "Expediente_Jefe_Laboratorio - Cedula",
  "Expediente_Jefe_Laboratorio - Curriculum",
  "Expediente_Jefe_Laboratorio - Comprobante_habilidad",
  "Expediente_Jefe_Laboratorio - Comprobante_domicilio"
];

const BovedaSub4 = () => (
  <BovedaModulo titulo="Módulo 4: Personal Clave" documentosPermitidos={docs} />
);

export default BovedaSub4;
