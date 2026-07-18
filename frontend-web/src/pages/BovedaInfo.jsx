import React from 'react';
import { Typography, Card, Collapse, Space } from 'antd';
import { InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const BovedaInfo = () => {
  return (
    <div style={{ padding: '32px', maxWidth: '1600px', margin: '0 auto' }}>
      <Title level={2}>Guía de Requisitos - Bóveda Digital</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
        A continuación, se detalla la documentación requerida para cada uno de los módulos de la bóveda digital, así como sus vigencias y especificaciones.
      </Text>

      <Collapse
        defaultActiveKey={['1']}
        expandIconPosition="end"
        style={{ background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '8px' }}
      >
        <Panel
          header={<Text strong style={{ fontSize: '16px' }}><InfoCircleOutlined style={{ color: '#F5A623', marginRight: '8px' }} />1. Módulo Legal y Acreditación</Text>}
          key="1"
        >
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Acta Constitutiva y Modificaciones:</b> Escrituras públicas inscritas en el Registro Público correspondiente.</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Identificación Oficial del Administrador Único:</b> INE, pasaporte o cartilla vigente.</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Identificación Oficial del Representante Legal:</b> INE, pasaporte o cartilla vigente.</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Comprobante de Domicilio del Administrador Único:</b> Recibo de luz, agua o teléfono (vigencia máxima de 90 días).</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Comprobante de Domicilio del Representante Legal:</b> Recibo de luz, agua o teléfono (vigencia máxima de 90 días).</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Poder Notarial:</b> Instrumento legal del apoderado (si aplica) e identificación oficial.</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Constancia de Situación Fiscal (SAT):</b> Actualización mensual (vigencia máxima de 30 días).</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Opinión de Cumplimiento SAT (32-D):</b> Opinión en sentido positivo (vigencia máxima de 30 días).</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Opinión de Cumplimiento IMSS:</b> Opinión en sentido positivo (vigencia máxima de 15 días).</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Constancia de Situación Fiscal INFONAVIT:</b> Documento vigente en sentido "sin adeudo".</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Constancia de No Adeudo Estatal:</b> Emitida por la Secretaría de Finanzas.</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Padrón de Contratistas:</b> Constancia de inscripción estatal vigente.</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Constancia de No Inhabilitación:</b> Emitida por la Secretaría de Honestidad (vigente).</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Identificación Patronal:</b> Tarjeta del IMSS.</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Padrón de Contratistas:</b> Secretaría de honestidad, transparencia y función publica.</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Políticas de Integridad:</b> Documento de políticas de integridad empresarial y anticorrupción.</Text>
          </Space>
        </Panel>

        <Panel
          header={<Text strong style={{ fontSize: '16px' }}><InfoCircleOutlined style={{ color: '#F5A623', marginRight: '8px' }} />2. Módulo de Experiencia y Operación</Text>}
          key="2"
        >
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Currículum Corporativo:</b> Documento general con la historia y capacidad de la empresa.</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Obras Ejecutadas (Últimos 3 años):</b> Listado respaldado por contratos, actas de entrega-recepción y fianzas de vicios ocultos.</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Obras en Vigor:</b> Relación actualizada de contratos activos con importes totales, ejercidos y por ejercer.</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Acreditación de Domicilio:</b> Comprobante domiciliario (menor a 3 meses), croquis de macro y micro localización georreferenciados (coordenadas UTM) y fotografías a color recientes (interior/exterior) del inmueble.</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Expedientes de Maquinaria:</b> Facturas o cartas de arrendamiento de la maquinaria disponible.</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Listado de Maquinaria:</b> Listado de la maquinaria con la que se cuenta.</Text>
          </Space>
        </Panel>

        <Panel
          header={<Text strong style={{ fontSize: '16px' }}><InfoCircleOutlined style={{ color: '#F5A623', marginRight: '8px' }} />3. Módulo Financiero y Contable</Text>}
          key="3"
        >
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Declaración Anual previas:</b> Incluye acuse de recibo y estados financieros en Excel.</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Declaraciones Provisionales:</b> Acuses de pagos provisionales y definitivos de los últimos 3 meses.</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Estados Financieros (Anual y Parciales):</b> Balance general, Estado de resultados, Flujo de efectivo y Variaciones, firmados por el representante y el contador.</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Expediente del Contador Público:</b> Cédula profesional, registro SAT, afiliación al colegio, identificación y su constancia de situación fiscal.</Text>
          </Space>
        </Panel>

        <Panel
          header={<Text strong style={{ fontSize: '16px' }}><InfoCircleOutlined style={{ color: '#F5A623', marginRight: '8px' }} />4. Módulo de Personal Clave</Text>}
          key="4"
        >
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Expediente D.R.O.:</b> Licencia clase A de la SIC, identificación, cédula, currículum firmado y comprobantes de 5 obras similares, comprobante de domicilio.</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Expediente Superintendente:</b> Identificación, cédula, currículum firmado y comprobantes de 5 obras similares, comprobante de domicilio.</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Expediente Auxiliar de Superintendente:</b> Cédula profesional, currículum firmado y comprobantes de habilidad/competencia, comprobante de domicilio.</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Expediente Jefe de Topografía:</b> Cédula profesional, currículum firmado y comprobantes de habilidad/competencia, comprobante de domicilio.</Text>
            <Text><CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} /> <b>Expediente Jefe de Laboratorio:</b> Cédula profesional, currículum firmado y comprobantes de habilidad/competencia, comprobante de domicilio.</Text>
          </Space>
        </Panel>

      </Collapse>
    </div>
  );
};

export default BovedaInfo;
