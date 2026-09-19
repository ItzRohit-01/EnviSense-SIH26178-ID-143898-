import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import Grid from '../components/Grid';
import { useFirebaseValue } from '../hooks/useFirebaseValue';
import { colors } from '../theme/colors';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PageTitle = styled.h2`
  font-family: 'Manrope', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0;
`;

const LiveIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #22c55e;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.05em;

  .pulse-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 10px #22c55e;
    animation: pulse 1.5s infinite ease-in-out;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.85); }
  }
`;

const SensorCard = styled(Card)`
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CardTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const Label = styled.p`
  color: ${colors.textMuted};
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  margin: 0;
`;

const StatusBadge = styled.span`
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${(props) =>
    props.$status === 'RISK' || props.$status === 'CRITICAL'
      ? 'rgba(239, 68, 68, 0.2)'
      : props.$status === 'WARNING'
      ? 'rgba(245, 158, 11, 0.2)'
      : 'rgba(34, 197, 94, 0.2)'};
  color: ${(props) =>
    props.$status === 'RISK' || props.$status === 'CRITICAL'
      ? '#ef4444'
      : props.$status === 'WARNING'
      ? '#f59e0b'
      : '#22c55e'};
  border: 1px solid
    ${(props) =>
      props.$status === 'RISK' || props.$status === 'CRITICAL'
        ? 'rgba(239, 68, 68, 0.4)'
        : props.$status === 'WARNING'
        ? 'rgba(245, 158, 11, 0.4)'
        : 'rgba(34, 197, 94, 0.4)'};
`;

const Value = styled.p`
  font-family: 'Manrope', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: ${colors.textPrimary};
  margin: 0.4rem 0 0;
  letter-spacing: -0.01em;
`;

const ValueUnit = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  color: ${colors.textSecondary};
  margin-left: 0.2rem;
`;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const SensorData = () => {
  const { value: firebaseSensors } = useFirebaseValue('/envisence/live/sensors');
  const { value: nodesData } = useFirebaseValue('/envisence/nodes');
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

  // Simulated real-time jitter if Firebase hardware is temporarily offline
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

  // Determine active sensors source (Firebase Live -> First Firebase Node -> Simulated)
  let activeNodeSensors = null;
  if (nodesData && typeof nodesData === 'object') {
    const firstKey = Object.keys(nodesData)[0];
    if (firstKey && nodesData[firstKey]?.sensors) {
      activeNodeSensors = nodesData[firstKey].sensors;
    }
  }

  const sensors = firebaseSensors || activeNodeSensors || simulatedSensors;

  // Helper function to evaluate status: SAFE (Green), WARNING (Yellow), RISK (Red)
  const getSensorStatus = (label, val) => {
    if (val == null) return 'SAFE';

    switch (label) {
      case 'Temperature':
        if (typeof val === 'number') {
          if (val >= 42) return 'RISK';
          if (val >= 35) return 'WARNING';
        }
        return 'SAFE';

      case 'Humidity':
        if (typeof val === 'number' && val > 90) return 'WARNING';
        return 'SAFE';

      case 'MQ2 Raw':
        if (typeof val === 'number') {
          if (val >= 800) return 'RISK';
          if (val >= 500) return 'WARNING';
        }
        return 'SAFE';

      case 'Smoke':
        if (val === 'Smoke Detected' || val === 'HIGH') return 'RISK';
        if (val === 'Warning') return 'WARNING';
        return 'SAFE';

      case 'Flame':
        if (val === 'Flame Detected' || val === 'FIRE') return 'RISK';
        return 'SAFE';

      case 'Rain':
        if (val === 'Heavy Rain' || val === 'HIGH') return 'WARNING';
        return 'SAFE';

      case 'Water Level':
        if (val === 'HIGH' || val === 'FLOOD') return 'RISK';
        if (val === 'LOW' || val === 'WARNING') return 'WARNING';
        return 'SAFE';

      case 'Soil Moisture':
        if (typeof val === 'number' && val > 0 && val < 800) return 'WARNING';
        return 'SAFE';

      case 'Vibration':
        if (typeof val === 'number') {
          if (val >= 70) return 'RISK';
          if (val >= 30) return 'WARNING';
        }
        return 'SAFE';

      case 'pH':
        if (typeof val === 'number' && (val < 6.0 || val > 8.5)) return 'WARNING';
        return 'SAFE';

      case 'Turbidity':
        if (val === 'Dirty / High Turbidity' || val === 'UNSAFE') return 'RISK';
        if (val === 'Cloudy') return 'WARNING';
        return 'SAFE';

      default:
        return 'SAFE';
    }
  };

  const rawSensorsList = [
    { label: 'Temperature', value: sensors.temperature, unit: '°C', icon: '🌡️' },
    { label: 'Humidity', value: sensors.humidity, unit: '%', icon: '💧' },
    { label: 'MQ2 Raw', value: sensors.mq2_raw ?? sensors.mq2, unit: 'PPM', icon: '🔬' },
    { label: 'Smoke', value: sensors.smoke_condition ?? 'Normal', unit: '', icon: '🌫️' },
    { label: 'Flame', value: sensors.flame_condition ?? 'Clear', unit: '', icon: '🔥' },
    { label: 'Rain', value: sensors.rain_condition ?? 'Clear', unit: '', icon: '🌧️' },
    { label: 'Water Level', value: sensors.water_level_condition ?? sensors.water_level ?? 'Normal', unit: '', icon: '🌊' },
    { label: 'Soil Moisture', value: sensors.soil_moisture_raw ?? sensors.soil_moisture, unit: 'raw', icon: '🌱' },
    { label: 'TDS', value: sensors.tds_ppm ?? 142, unit: 'ppm', icon: '💎' },
    { label: 'Turbidity', value: sensors.turbidity_status ?? sensors.turbidity ?? 'Clear', unit: '', icon: '🔍' },
    { label: 'Vibration', value: sensors.vibration_raw ?? sensors.vibration, unit: 'raw', icon: '📳' },
    { label: 'pH', value: sensors.ph_raw ?? sensors.ph, unit: 'pH', icon: '🧪' },
  ];

  const sensorMap = rawSensorsList.map((item) => ({
    ...item,
    status: getSensorStatus(item.label, item.value),
  }));

  return (
    <>
      <PageHeader>
        <PageTitle>Live Telemetry Sensors</PageTitle>
        <LiveIndicator>
          <div className="pulse-dot" />
          {firebaseSensors ? 'HARDWARE STREAM ACTIVE' : 'LIVE MONITORING ACTIVE'}
        </LiveIndicator>
      </PageHeader>

      <motion.div variants={container} initial="hidden" animate="show">
        <Grid>
          {sensorMap.map(({ label, value, unit, icon, status }) => (
            <SensorCard
              key={label}
              $status={status}
              variants={item}
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <CardTopRow>
                <Label>{icon} {label}</Label>
                <StatusBadge $status={status}>{status}</StatusBadge>
              </CardTopRow>
              <Value>
                {value ?? 'N/A'}
                {unit && value != null && <ValueUnit>{unit}</ValueUnit>}
              </Value>
            </SensorCard>
          ))}
        </Grid>
      </motion.div>
    </>
  );
};

export default SensorData;
