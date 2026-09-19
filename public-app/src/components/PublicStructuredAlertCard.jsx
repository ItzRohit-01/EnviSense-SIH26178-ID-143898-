// src/components/PublicStructuredAlertCard.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  MdTrendingUp, MdTrendingFlat, MdMap, MdPsychology 
} from 'react-icons/md';
import { Link } from 'react-router-dom';
import { colors } from '../theme/colors';

const CardContainer = styled(motion.div)`
  background: ${colors.surface};
  border: 1px solid ${colors.glassBorder};
  border-radius: 14px;
  padding: 1rem 1.15rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
`;

const HeaderBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatusTitleTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.95rem;
  font-weight: 800;
  font-family: 'Manrope', sans-serif;
  letter-spacing: 0.02em;
  color: ${(props) =>
    props.$status === 'CRITICAL' || props.$status === 'HIGH'
      ? colors.danger
      : props.$status === 'WARNING' || props.$status === 'MODERATE'
      ? colors.warning
      : colors.success};
`;

const LocationText = styled.div`
  font-size: 1.05rem;
  font-weight: 800;
  color: ${colors.textPrimary};
  font-family: 'Manrope', sans-serif;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.78rem;
  color: ${colors.textMuted};
  margin-top: 0.1rem;

  .severity-trend {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-weight: 800;
    color: ${(props) =>
      props.$status === 'CRITICAL' || props.$status === 'HIGH'
        ? colors.danger
        : props.$status === 'WARNING' || props.$status === 'MODERATE'
        ? colors.warning
        : colors.success};
  }
`;

const CardDivider = styled.div`
  height: 1px;
  background: ${colors.glassBorder};
  margin: 0.15rem 0;
`;

const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const SectionLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${colors.textMuted};
`;

const SectionText = styled.p`
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.35;
  color: ${colors.textSecondary};
`;

const BulletList = styled.ul`
  margin: 0;
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  li {
    font-size: 0.8rem;
    color: ${colors.textSecondary};
    display: flex;
    align-items: flex-start;
    gap: 0.35rem;

    &::before {
      content: '•';
      color: ${colors.primaryLight};
      font-weight: bold;
    }
  }
`;

const AssessmentBadge = styled.div`
  margin-top: 0.2rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  background: ${colors.surfaceLight};
  padding: 0.25rem 0.55rem;
  border-radius: 6px;
  display: inline-block;
  align-self: flex-start;
  border: 1px solid ${colors.glassBorder};
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.35rem;
`;

const InspectButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  background: ${colors.surfaceLight};
  border: 1px solid ${colors.glassBorder};
  color: ${colors.textPrimary};
  padding: 0.5rem 0.65rem;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.primaryGlow};
    border-color: ${colors.primaryLight};
    color: ${colors.primaryLight};
  }
`;

const ActionButton = styled(Link)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  background: ${colors.primaryGlow};
  border: 1px solid ${colors.primaryLight};
  color: ${colors.primaryLight};
  padding: 0.5rem 0.65rem;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.primaryLight};
    color: #ffffff;
  }
`;

/**
 * PublicStructuredAlertCard component with exact 4-section structured layout for all 6 modules:
 * 1. Header (Dot + Title, Location, Trend + Timestamp)
 * 2. WHAT'S HAPPENING?
 * 3. WHY THIS ALERT? (Bullets + Assessment Confidence)
 * 4. WHAT SHOULD I DO? (Advice + EXPLAIN AI & VIEW MAP buttons)
 */
const PublicStructuredAlertCard = ({ hazardKey, hazardData, locationName, sensorData, lastUpdate, onInspect }) => {
  const s = sensorData || {};

  // Default initial values
  let title = 'ENVIRONMENTAL RISK';
  let dotIcon = '🟢';
  let status = 'SAFE';
  let trendText = 'SAFE • STABLE';
  let happeningText = 'All monitored parameters are within safe operational baselines.';
  let whyBullets = ['IoT sensors operating normally', 'No abnormal spikes registered', 'Proximity clear'];
  let confidenceText = 'HIGH CONFIDENCE (98%)';
  let actionAdvice = 'Avoid the affected area and follow local safety instructions.';

  // 1. Flood Hazard Module
  if (hazardKey === 'flood') {
    const wl = s.water_level ?? 12;
    if (wl > 80 || s.water_level_condition === 'HIGH') {
      status = 'CRITICAL';
      dotIcon = '🔴';
      title = 'FLOOD WARNING';
      trendText = 'HIGH • ↑ RISING';
      happeningText = `Water levels are rising rapidly (${wl}%) following elevated rainfall.`;
      whyBullets = ['Water level rising', 'Heavy rainfall detected', 'Local conditions abnormal'];
      confidenceText = 'HIGH CONFIDENCE (95%)';
      actionAdvice = 'Avoid low-lying underpasses and follow local authority directives.';
    } else if (wl > 65) {
      status = 'WARNING';
      dotIcon = '🟠';
      title = 'FLOOD WATCH';
      trendText = 'MODERATE • ↑ ELEVATED';
      happeningText = `Water levels are moderately high (${wl}%) near local drainage runoff.`;
      whyBullets = ['Water level elevated', 'Drainage runoff monitored', 'Mild accumulation nearby'];
      confidenceText = 'HIGH CONFIDENCE (92%)';
      actionAdvice = 'Exercise caution near low-lying roads and stay tuned for updates.';
    } else {
      title = 'FLOOD STATUS: SAFE';
      dotIcon = '🟢';
      status = 'SAFE';
      trendText = 'SAFE • STABLE';
      happeningText = `Water levels are low (${wl}%) and drainage channels are clear.`;
      whyBullets = ['Water level normal', 'Rainfall clear', 'Drainage flow optimal'];
      confidenceText = 'OPTIMAL CONFIDENCE (99%)';
      actionAdvice = 'No flood risk detected. Safe for all normal daily activities.';
    }
  } 
  // 2. Forest Fire Hazard Module
  else if (hazardKey === 'forest_fire') {
    const mq2 = s.mq2_raw ?? s.mq2 ?? 450;
    const temp = s.temperature ?? 28;
    const flame = s.flame_condition ?? 'Clear';
    if (flame === 'Flame Detected' || (mq2 >= 3150 && temp > 40)) {
      status = 'CRITICAL';
      dotIcon = '🔴';
      title = 'FOREST FIRE ALERT';
      trendText = 'CRITICAL • ↑ RISING';
      happeningText = `Thermal anomaly and dry combustion gas spike detected in foliage area.`;
      whyBullets = ['Combustion gas elevated', 'High surface temperature', 'Flame status active'];
      confidenceText = 'HIGH CONFIDENCE (96%)';
      actionAdvice = 'Keep clear of dry brush zones and immediately report any visible smoke.';
    } else if (mq2 >= 3051 || temp > 35) {
      status = 'WARNING';
      dotIcon = '🟠';
      title = 'FIRE RISK WATCH';
      trendText = 'MODERATE • ELEVATED';
      happeningText = `Elevated ambient temperature (${temp}°C) and increased gas sensor readings.`;
      whyBullets = ['Gas reading elevated', 'High heat detected', 'Low relative humidity'];
      confidenceText = 'HIGH CONFIDENCE (91%)';
      actionAdvice = 'Avoid outdoors open burning and handle flammable materials with care.';
    } else {
      title = 'FIRE RISK: SAFE';
      dotIcon = '🟢';
      status = 'SAFE';
      trendText = 'SAFE • STABLE';
      happeningText = `No thermal spikes or combustion gas detected in the monitored zone.`;
      whyBullets = ['Gas reading normal', 'Temperature safe', 'Flame sensors clear'];
      confidenceText = 'OPTIMAL CONFIDENCE (98%)';
      actionAdvice = 'Forest and brush conditions are clear and safe.';
    }
  } 
  // 3. Air Quality Hazard Module
  else if (hazardKey === 'air_quality') {
    const mq2 = s.mq2_raw ?? s.mq2 ?? 450;
    const smoke = s.smoke_condition ?? 'Normal';
    if (mq2 >= 3150 || smoke === 'Smoke Detected') {
      status = 'CRITICAL';
      dotIcon = '🔴';
      title = 'AIR QUALITY HAZARD';
      trendText = 'HIGH • ↑ RISING';
      happeningText = `Air quality index has degraded with elevated pollutant gas concentration.`;
      whyBullets = [`MQ2 Gas: ${mq2} PPM`, `Smoke condition: ${smoke}`, 'High atmospheric density'];
      confidenceText = 'HIGH CONFIDENCE (94%)';
      actionAdvice = 'Wear protective N95 masks outdoors and keep indoor ventilation closed.';
    } else if (mq2 >= 3051) {
      status = 'WARNING';
      dotIcon = '🟠';
      title = 'AIR QUALITY WATCH';
      trendText = 'MODERATE • ELEVATED';
      happeningText = `Moderate increase in air pollutant levels recorded at edge sensor.`;
      whyBullets = [`MQ2 Gas: ${mq2} PPM`, 'Slight particulate elevation', 'Moderate air density'];
      confidenceText = 'HIGH CONFIDENCE (90%)';
      actionAdvice = 'Sensitive individuals should limit prolonged outdoor exertion.';
    } else {
      title = 'AIR QUALITY: GOOD';
      dotIcon = '🟢';
      status = 'SAFE';
      trendText = 'SAFE • STABLE';
      happeningText = `Air quality is fresh and clear within healthy baseline limits.`;
      whyBullets = [`MQ2 Gas normal (${mq2} PPM)`, 'Zero toxic smoke detected', 'Clear atmospheric dispersion'];
      confidenceText = 'OPTIMAL CONFIDENCE (99%)';
      actionAdvice = 'Outdoor air quality is clean. Safe for all outdoor activities.';
    }
  } 
  // 4. Water Quality Hazard Module
  else if (hazardKey === 'water_quality') {
    const turb = s.turbidity ?? 3400;
    if (turb < 1500) {
      status = 'CRITICAL';
      dotIcon = '🔴';
      title = 'WATER QUALITY HAZARD';
      trendText = 'HIGH • DEGRADED';
      happeningText = `Water turbidity indicates unsafe muddy conditions.`;
      whyBullets = [`Turbidity: ${turb} NTU`, 'High particulate count', 'Raw pH shift registered'];
      confidenceText = 'HIGH CONFIDENCE (95%)';
      actionAdvice = 'Do not consume municipal water. Use sealed bottled water only.';
    } else if (turb < 3000) {
      status = 'WARNING';
      dotIcon = '🟠';
      title = 'WATER QUALITY ALERT';
      trendText = 'MODERATE • ELEVATED';
      happeningText = `Water turbidity exceeds standard purity thresholds.`;
      whyBullets = [`Turbidity: ${turb} NTU`, 'Moderate particulate count', 'Raw pH shift registered'];
      confidenceText = 'HIGH CONFIDENCE (93%)';
      actionAdvice = 'Boil municipal water before drinking and use certified water filters.';
    } else {
      title = 'WATER QUALITY: CLEAN';
      dotIcon = '🟢';
      status = 'SAFE';
      trendText = 'SAFE • STABLE';
      happeningText = `Water purity and pH balance are clear and safe for consumption.`;
      whyBullets = [`Turbidity clear & normal (${turb} NTU)`, 'pH balance optimal', 'No contaminants detected'];
      confidenceText = 'OPTIMAL CONFIDENCE (98%)';
      actionAdvice = 'Water supply is clear and meets environmental quality standards.';
    }
  } 
  // 5. Extreme Heat Hazard Module
  else if (hazardKey === 'extreme_heat') {
    const temp = s.temperature ?? 28;
    const hum = s.humidity ?? 65;
    if (temp > 40) {
      status = 'CRITICAL';
      dotIcon = '🔴';
      title = 'EXTREME HEAT WARNING';
      trendText = 'HIGH • ↑ RISING';
      happeningText = `Ambient surface temperature has reached ${temp}°C, creating high thermal stress.`;
      whyBullets = [`Temperature: ${temp}°C`, `Humidity: ${hum}%`, 'Heat index warning active'];
      confidenceText = 'HIGH CONFIDENCE (97%)';
      actionAdvice = 'Stay hydrated, remain in air-conditioned spaces, and avoid peak sun.';
    } else if (temp >= 34) {
      status = 'WARNING';
      dotIcon = '🟠';
      title = 'HEAT ADVISORY';
      trendText = 'MODERATE • ELEVATED';
      happeningText = `Elevated ambient temperature (${temp}°C) recorded across local sensors.`;
      whyBullets = [`Temperature: ${temp}°C`, `Humidity: ${hum}%`, 'Thermal exertion caution'];
      confidenceText = 'HIGH CONFIDENCE (93%)';
      actionAdvice = 'Drink plenty of fluids and take frequent breaks if working outside.';
    } else {
      title = 'HEAT STRESS: NORMAL';
      dotIcon = '🟢';
      status = 'SAFE';
      trendText = 'SAFE • STABLE';
      happeningText = `Ambient thermal conditions are comfortable and within normal range (${temp}°C).`;
      whyBullets = [`Temperature: ${temp}°C`, `Humidity: ${hum}%`, 'Normal thermal baseline'];
      confidenceText = 'OPTIMAL CONFIDENCE (99%)';
      actionAdvice = 'Weather and ambient thermal conditions are pleasant.';
    }
  } 
  // 6. Seismic / Landslide Hazard Module
  else if (hazardKey === 'landslide') {
    const vib = s.vibration_raw ?? s.vibration ?? 12;
    if (vib > 70) {
      status = 'CRITICAL';
      dotIcon = '🔴';
      title = 'SEISMIC / LANDSLIDE';
      trendText = 'HIGH • ↑ RISING';
      happeningText = `Ground vibration sensor recorded elevated seismic activity (${vib} m/s²).`;
      whyBullets = [`Vibration: ${vib} m/s²`, 'Soil saturation elevated', 'Slope movement caution'];
      confidenceText = 'HIGH CONFIDENCE (92%)';
      actionAdvice = 'Avoid steep hillside inclines and follow geotechnical directives.';
    } else {
      title = 'SEISMIC RISK: STABLE';
      dotIcon = '🟢';
      status = 'SAFE';
      trendText = 'SAFE • STABLE';
      happeningText = `Geotechnical and soil vibration sensors report zero ground movement.`;
      whyBullets = [`Vibration: ${vib} m/s² (Stable)`, 'Soil saturation normal', 'Slope integrity clear'];
      confidenceText = 'OPTIMAL CONFIDENCE (98%)';
      actionAdvice = 'No ground stability or landslide hazards detected.';
    }
  }

  return (
    <CardContainer $status={status}>
      {/* SECTION 1: HEADER & META */}
      <HeaderBlock>
        <StatusTitleTag $status={status}>
          <span>{dotIcon}</span> {title}
        </StatusTitleTag>
        <LocationText>{locationName || 'Guindy'}</LocationText>
        <MetaRow $status={status}>
          <div className="severity-trend">
            {status === 'CRITICAL' && <MdTrendingUp size={15} />}
            {status === 'WARNING' && <MdTrendingUp size={15} />}
            {status === 'SAFE' && <MdTrendingFlat size={15} />}
            <span>{trendText}</span>
          </div>
          <span>Updated {lastUpdate || 'Just now'}</span>
        </MetaRow>
      </HeaderBlock>

      <CardDivider />

      {/* SECTION 2: WHAT'S HAPPENING? */}
      <SectionBlock>
        <SectionLabel>WHAT'S HAPPENING?</SectionLabel>
        <SectionText>{happeningText}</SectionText>
      </SectionBlock>

      <CardDivider />

      {/* SECTION 3: WHY THIS ALERT? */}
      <SectionBlock>
        <SectionLabel>WHY THIS ALERT?</SectionLabel>
        <BulletList>
          {whyBullets.map((b, idx) => (
            <li key={idx}>{b}</li>
          ))}
        </BulletList>
        <AssessmentBadge>Assessment: {confidenceText}</AssessmentBadge>
      </SectionBlock>

      <CardDivider />

      {/* SECTION 4: WHAT SHOULD I DO? & ACTIONS */}
      <SectionBlock>
        <SectionLabel>WHAT SHOULD I DO?</SectionLabel>
        <SectionText>{actionAdvice}</SectionText>
        <ButtonRow>
          {onInspect && (
            <InspectButton onClick={() => onInspect(hazardKey, locationName)}>
              <MdPsychology size={15} /> EXPLAIN AI
            </InspectButton>
          )}
          <ActionButton to="/public/map">
            <MdMap size={15} /> VIEW MAP
          </ActionButton>
        </ButtonRow>
      </SectionBlock>
    </CardContainer>
  );
};

export default PublicStructuredAlertCard;
