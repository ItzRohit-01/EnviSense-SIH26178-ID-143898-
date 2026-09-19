import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  MdAir, MdWaterDrop, MdThermostat, MdCheckCircle, MdWarning, 
  MdScience, MdSpeed, MdCloudQueue
} from 'react-icons/md';
import Card from '../components/Card';
import Grid from '../components/Grid';
import { useFirebaseValue } from '../hooks/useFirebaseValue';
import { colors } from '../theme/colors';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PageTitleGroup = styled.div`
  h2 {
    font-family: 'Manrope', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: ${colors.textPrimary};
    margin: 0 0 0.25rem 0;
  }
  p {
    margin: 0;
    font-size: 0.88rem;
    color: ${colors.textSecondary};
  }
`;

const SectionCard = styled(Card)`
  text-align: left;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const CardTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;

  .icon-box {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: ${colors.surfaceLight};
    color: ${colors.primaryLight};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
  }
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  font-family: 'Manrope', sans-serif;
  color: ${colors.textPrimary};
  margin: 0;
`;

const LiveBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${(props) =>
    props.$status === 'CRITICAL' || props.$status === 'HIGH' || props.$status === 'RISK' || props.$status === 'HIGH RISK'
      ? 'hsla(0, 75%, 58%, 0.15)'
      : props.$status === 'WARNING' || props.$status === 'MODERATE'
      ? 'hsla(45, 95%, 55%, 0.15)'
      : 'hsla(152, 70%, 48%, 0.15)'};
  color: ${(props) =>
    props.$status === 'CRITICAL' || props.$status === 'HIGH' || props.$status === 'RISK' || props.$status === 'HIGH RISK'
      ? colors.danger
      : props.$status === 'WARNING' || props.$status === 'MODERATE'
      ? colors.warning
      : colors.success};
  border: 1px solid
    ${(props) =>
      props.$status === 'CRITICAL' || props.$status === 'HIGH' || props.$status === 'RISK' || props.$status === 'HIGH RISK'
        ? 'hsla(0, 75%, 58%, 0.3)'
        : props.$status === 'WARNING' || props.$status === 'MODERATE'
        ? 'hsla(45, 95%, 55%, 0.3)'
        : 'hsla(152, 70%, 48%, 0.3)'};
`;

const DataList = styled.div`
  margin-bottom: 0.5rem;
`;

const DataRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${colors.glassBorder};
  font-size: 0.88rem;

  &:last-child {
    border-bottom: none;
  }
`;

const DataLabel = styled.span`
  color: ${colors.textMuted};
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const DataValue = styled.span`
  color: ${colors.textPrimary};
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
`;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const EnvironmentalMonitoring = () => {
  const { value: firebaseSensors, loading: sensorsLoading } = useFirebaseValue('/envisence/live/sensors');
  const { value: nodesData } = useFirebaseValue('/envisence/nodes');
  const { value: airQuality, loading: airLoading } = useFirebaseValue('/envisence/live/air_quality');
  const { value: waterQuality, loading: waterLoading } = useFirebaseValue('/envisence/live/water_quality');

  const [simulatedSensors, setSimulatedSensors] = useState({
    temperature: 32.4,
    humidity: 58,
    mq2_raw: 412,
    smoke_condition: 'Normal',
    flame_condition: 'Clear',
    rain_condition: 'Clear',
    water_level_condition: 'Normal',
    soil_moisture_raw: 1450,
    tds_ppm: 142,
    turbidity_status: 'Clear',
    vibration_raw: 14,
    ph_raw: 7.2,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedSensors((prev) => ({
        ...prev,
        temperature: parseFloat((31.5 + Math.random() * 2).toFixed(1)),
        humidity: Math.floor(55 + Math.random() * 8),
        mq2_raw: Math.floor(390 + Math.random() * 50),
        vibration_raw: Math.floor(10 + Math.random() * 8),
        ph_raw: parseFloat((7.1 + Math.random() * 0.3).toFixed(1)),
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  let activeNodeSensors = null;
  if (nodesData && typeof nodesData === 'object') {
    const firstKey = Object.keys(nodesData)[0];
    if (firstKey && nodesData[firstKey]?.sensors) {
      activeNodeSensors = nodesData[firstKey].sensors;
    }
  }

  const sensors = firebaseSensors || activeNodeSensors || simulatedSensors;
  const loading = sensorsLoading || airLoading || waterLoading;

  // Dynamic Air Quality status computation
  const mq2Val = sensors?.mq2_raw ?? 450;
  const smokeCond = sensors?.smoke_condition ?? 'Normal';
  const flameCond = sensors?.flame_condition ?? 'Clear';
  let airStatus = 'SAFE';
  if (airQuality?.status === 'SAFE' || airQuality?.ai_prediction === 'SAFE') {
    airStatus = 'SAFE';
  } else if (airQuality?.status === 'WARNING' || airQuality?.ai_prediction === 'WARNING') {
    airStatus = 'WARNING';
  } else if (airQuality?.status === 'RISK' || airQuality?.ai_prediction === 'RISK' || airQuality?.ai_prediction === 'HIGH RISK' || airQuality?.ai_prediction === 'CRITICAL' || airQuality?.status === 'CRITICAL') {
    airStatus = 'RISK';
  }

  // Dynamic Water Quality status computation
  const phRaw = sensors?.ph_raw ?? 2400;
  const tdsVal = sensors?.tds_ppm ?? 180;
  const turbidityStatus = sensors?.turbidity_status ?? 'Clear';
  let waterStatus = 'SAFE';
  if (waterQuality?.status === 'SAFE' || waterQuality?.ai_prediction === 'SAFE') {
    waterStatus = 'SAFE';
  } else if (waterQuality?.status === 'WARNING' || waterQuality?.ai_prediction === 'WARNING') {
    waterStatus = 'WARNING';
  } else if (waterQuality?.status === 'RISK' || waterQuality?.ai_prediction === 'RISK' || waterQuality?.ai_prediction === 'HIGH RISK' || waterQuality?.ai_prediction === 'CRITICAL' || waterQuality?.status === 'CRITICAL') {
    waterStatus = 'RISK';
  }

  // Climate status computation
  const tempVal = sensors?.temperature ?? 28;
  const humVal = sensors?.humidity ?? 65;
  let climateStatus = 'SAFE';
  if (tempVal >= 40) {
    climateStatus = 'RISK';
  } else if (tempVal >= 36) {
    climateStatus = 'WARNING';
  }

  return (
    <>
      <PageHeader>
        <PageTitleGroup>
          <h2>Live Public Environmental Conditions</h2>
          <p>Real-time IoT telemetry and ambient condition readings</p>
        </PageTitleGroup>
      </PageHeader>

      {loading ? (
        <p style={{ color: colors.textMuted }}>Loading environmental telemetry data…</p>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show">
          <Grid>
            {/* Air Quality */}
            <SectionCard $status={airStatus} variants={item} whileHover={{ y: -3 }}>
              <CardHeader>
                <CardTitleGroup>
                  <div className="icon-box">
                    <MdAir />
                  </div>
                  <CardTitle>Air Quality Index</CardTitle>
                </CardTitleGroup>
                <LiveBadge $status={airStatus}>
                  {airStatus === 'SAFE' ? <MdCheckCircle /> : <MdWarning />}
                  {airStatus}
                </LiveBadge>
              </CardHeader>
              <DataList>
                <DataRow>
                  <DataLabel><MdCloudQueue /> MQ2 Gas Level</DataLabel>
                  <DataValue>{mq2Val} PPM</DataValue>
                </DataRow>
                <DataRow>
                  <DataLabel><MdSpeed /> Smoke Condition</DataLabel>
                  <DataValue>{smokeCond}</DataValue>
                </DataRow>
                <DataRow>
                  <DataLabel><MdScience /> Flame Sensor</DataLabel>
                  <DataValue>{flameCond}</DataValue>
                </DataRow>
              </DataList>
            </SectionCard>

            {/* Water Quality */}
            <SectionCard $status={waterStatus} variants={item} whileHover={{ y: -3 }}>
              <CardHeader>
                <CardTitleGroup>
                  <div className="icon-box">
                    <MdWaterDrop />
                  </div>
                  <CardTitle>Water Quality & Purity</CardTitle>
                </CardTitleGroup>
                <LiveBadge $status={waterStatus}>
                  {waterStatus === 'SAFE' ? <MdCheckCircle /> : <MdWarning />}
                  {waterStatus}
                </LiveBadge>
              </CardHeader>
              <DataList>
                <DataRow>
                  <DataLabel><MdScience /> pH Level Raw</DataLabel>
                  <DataValue>{phRaw}</DataValue>
                </DataRow>
                <DataRow>
                  <DataLabel><MdSpeed /> TDS Concentration</DataLabel>
                  <DataValue>{tdsVal} PPM</DataValue>
                </DataRow>
                <DataRow>
                  <DataLabel><MdCloudQueue /> Turbidity Status</DataLabel>
                  <DataValue>{turbidityStatus}</DataValue>
                </DataRow>
              </DataList>
            </SectionCard>

            {/* Climate */}
            <SectionCard $status={climateStatus} variants={item} whileHover={{ y: -3 }}>
              <CardHeader>
                <CardTitleGroup>
                  <div className="icon-box">
                    <MdThermostat />
                  </div>
                  <CardTitle>Climate & Ambient Temp</CardTitle>
                </CardTitleGroup>
                <LiveBadge $status={climateStatus}>
                  {climateStatus === 'SAFE' ? <MdCheckCircle /> : <MdWarning />}
                  {climateStatus}
                </LiveBadge>
              </CardHeader>
              <DataList>
                <DataRow>
                  <DataLabel><MdThermostat /> Temperature</DataLabel>
                  <DataValue>{tempVal} °C</DataValue>
                </DataRow>
                <DataRow>
                  <DataLabel><MdWaterDrop /> Relative Humidity</DataLabel>
                  <DataValue>{humVal} %</DataValue>
                </DataRow>
                <DataRow>
                  <DataLabel><MdCloudQueue /> Rain Condition</DataLabel>
                  <DataValue>{sensors?.rain_condition ?? 'Clear'}</DataValue>
                </DataRow>
              </DataList>
            </SectionCard>
          </Grid>
        </motion.div>
      )}
    </>
  );
};

export default EnvironmentalMonitoring;

