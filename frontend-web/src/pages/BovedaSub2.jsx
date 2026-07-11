import React from 'react';
import BovedaModulo from '../components/BovedaModulo';

const docs = [
  "Curriculum_Corporativo",
  "Obras_Ejecutadas_3_Anios",
  "Obras_en_Vigor",
  "Acreditacion_Domicilio",
  "Expedientes_Maquinaria",
  "Listado_Maquinaria"
];

const BovedaSub2 = () => (
  <BovedaModulo titulo="Módulo 2: Experiencia y Operación" documentosPermitidos={docs} />
);

export default BovedaSub2;
