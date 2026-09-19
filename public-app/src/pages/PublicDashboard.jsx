// src/pages/PublicDashboard.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  MdMyLocation, MdLocationCity, MdSensors, MdCheckCircle, MdWarning, MdError, MdArrowForward,
  MdLocalFireDepartment, MdWaves, MdThermostat, MdAir, MdLandscape, MdFactory, MdWaterDrop, MdOpacity
} from 'react-icons/md';
import { Link } from 'react-router-dom';
import { colors } from '../theme/colors';
import { useFirebaseValue } from '../hooks/useFirebaseValue';
import { useLocationContext } from '../context/LocationContext';
import { getActiveNodes, deriveHazardRisks } from '../services/locationService';
import PublicStructuredAlertCard from '../components/PublicStructuredAlertCard';
import RiskEventDetailModal from '../components/RiskEventDetailModal';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1050px;
  margin: 0 auto;
`;

const AreaHeaderCard = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.glassBorder};
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const AreaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  .icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: ${colors.primaryGlow};
    color: ${colors.primaryLight};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }

  h2 {
    margin: 0 0 0.2rem 0;
    font-size: 1.3rem;
    font-family: 'Manrope', sans-serif;
    color: ${colors.textPrimary};
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: ${colors.textSecondary};
  }
`;

const LocationControls = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  select {
    background: ${colors.surfaceLight};
    border: 1px solid ${colors.glassBorder};
    color: ${colors.textPrimary};
    padding: 0.55rem 0.85rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 500;
    outline: none;
    cursor: pointer;
    min-width: 200px;
    text-overflow: ellipsis;

    @media (max-width: 640px) {
      width: 100%;
    }
  }

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    background: ${colors.primaryGlow};
    border: 1px solid ${colors.primaryLight};
    color: ${colors.primaryLight};
    padding: 0.55rem 0.95rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;

    @media (max-width: 640px) {
      width: 100%;
    }

    &:hover {
      background: ${colors.primaryLight};
      color: #fff;
    }
  }
`;

const OverallStatusCard = styled(motion.div)`
  background: ${colors.surface};
  border: 1px solid
    ${(props) =>
      props.$status === 'SAFE'
        ? 'hsla(152, 70%, 48%, 0.25)'
        : props.$status === 'WARNING'
        ? 'hsla(45, 95%, 55%, 0.25)'
        : 'hsla(0, 75%, 58%, 0.25)'};
  border-radius: 16px;
  padding: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
  }
`;

const StatusTextGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;

  .status-icon {
    font-size: 3rem;
    color: ${(props) =>
      props.$status === 'SAFE'
        ? colors.success
        : props.$status === 'WARNING'
        ? colors.warning
        : colors.danger};
  }

  h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.5rem;
    font-family: 'Manrope', sans-serif;
    color: ${colors.textPrimary};
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: ${colors.textSecondary};
  }
`;

const NodeMetricBadge = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.glassBorder};
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  font-size: 0.85rem;
  color: ${colors.textSecondary};
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  strong {
    color: ${colors.textPrimary};
    font-size: 1rem;
  }

  @media (max-width: 640px) {
    align-items: center;
  }
`;

const WhyExplanationCard = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.glassBorder};
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  h4 {
    margin: 0;
    font-size: 1rem;
    font-family: 'Manrope', sans-serif;
    color: ${colors.textPrimary};
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .reasons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 0.75rem;
  }

  .reason-item {
    background: ${colors.surfaceLight};
    border: 1px solid ${colors.glassBorder};
    padding: 0.65rem 0.9rem;
    border-radius: 10px;
    font-size: 0.85rem;
    font-weight: 500;
    color: ${colors.textSecondary};
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
      color: ${colors.primaryLight};
      flex-shrink: 0;
    }
  }
`;

const LiveSensorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
`;

const SensorCard = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.glassBorder};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  }

  .card-top {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0.75rem;
    color: ${colors.textSecondary};
    font-size: 0.95rem;
    font-weight: 600;

    .icon-wrapper {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: ${colors.surfaceLight};
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        font-size: 1.3rem;
        color: ${colors.primary};
      }
    }
  }

  .value {
    font-family: 'Manrope', sans-serif;
    font-size: 2.2rem;
    font-weight: 800;
    color: ${colors.textPrimary};
    display: flex;
    align-items: baseline;
    gap: 0.4rem;

    span.unit {
      font-size: 1rem;
      font-weight: 600;
      color: ${colors.textMuted};
      text-transform: uppercase;
    }
  }

  .status-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    
    .standard {
      color: ${colors.textMuted};
    }
    
    .badge {
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: ${(props) => (props.$danger ? colors.danger : props.$warning ? colors.warning : colors.success)};
    }
  }
`;

const SectionTitle = styled.h3`
  font-family: 'Manrope', sans-serif;
  font-size: 1.15rem;
  color: ${colors.textPrimary};
  margin: 0.5rem 0 0.25rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HazardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
  gap: 1.25rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const QuickNavBanner = styled(Link)`
  background: ${colors.surfaceLight};
  border: 1px solid ${colors.glassBorder};
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  color: ${colors.textPrimary};
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${colors.primaryLight};
    color: ${colors.primaryLight};
  }
`;

const PublicDashboard = () => {
  const { value: firebaseData } = useFirebaseValue('envisence');
  const { selectedArea, presetLocations, setAreaByName, useCurrentLocation, getDistanceTo } = useLocationContext();
  const [inspectModule, setInspectModule] = useState(null);

  const nodes = getActiveNodes(firebaseData);

  // Find nearest node
  let nearestNode = nodes[0] || { 
    name: 'No Active Node', 
    risks: deriveHazardRisks({}) 
  };
  let minDistance = 999;
  
  if (nodes.length > 0) {
    nodes.forEach((n) => {
      const dist = getDistanceTo(n.lat, n.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearestNode = n;
      }
    });
  }

  const nodeRisks = nearestNode.risks;
  const liveSensorData = nearestNode.sensorData || firebaseData?.live?.sensors || {};

  const hazardKeys = ['water_quality', 'air_quality', 'flood', 'forest_fire', 'extreme_heat', 'landslide'];

  return (
    <Container>
      <AreaHeaderCard>
        <AreaInfo>
          <div className="icon">
            <MdLocationCity />
          </div>
          <div>
            <h2>Selected Area: {selectedArea}</h2>
            <p>Monitored via Nearest IoT Edge Node</p>
          </div>
        </AreaInfo>

        <LocationControls>
          <select value={selectedArea} onChange={(e) => setAreaByName(e.target.value)}>
            {presetLocations.map((loc) => (
              <option key={loc.name} value={loc.name}>
                {loc.name} ({loc.area})
              </option>
            ))}
          </select>

          <button onClick={useCurrentLocation}>
            <MdMyLocation /> GPS Location
          </button>
        </LocationControls>
      </AreaHeaderCard>

      <OverallStatusCard $status={nodeRisks.overallStatus === 'WARNING' ? 'WARNING' : nodeRisks.overallStatus === 'CRITICAL' ? 'CRITICAL' : 'SAFE'}>
        <StatusTextGroup $status={nodeRisks.overallStatus === 'WARNING' ? 'WARNING' : nodeRisks.overallStatus === 'CRITICAL' ? 'CRITICAL' : 'SAFE'}>
          <div className="status-icon">
            {(nodeRisks.overallStatus === 'SAFE' || nodeRisks.overallStatus === 'UNKNOWN') && <MdCheckCircle />}
            {nodeRisks.overallStatus === 'WARNING' && <MdWarning />}
            {nodeRisks.overallStatus === 'CRITICAL' && <MdError />}
          </div>
          <div>
            <h3>
              {nodeRisks.overallStatus === 'CRITICAL'
                ? 'OVERALL STATUS: CRITICAL HAZARD'
                : nodeRisks.overallStatus === 'WARNING'
                ? 'OVERALL STATUS: WARNING'
                : 'OVERALL STATUS: SAFE'}
            </h3>
            <p>
              {nodeRisks.overallStatus === 'CRITICAL'
                ? 'High environmental hazard detected! Take required safety measures.'
                : nodeRisks.overallStatus === 'WARNING'
                ? 'Elevated sensor levels recorded nearby. Review individual hazard alerts below.'
                : 'No active environmental risks detected in your area right now.'}
            </p>
          </div>
        </StatusTextGroup>

        <NodeMetricBadge>
          <span>Nearest Station</span>
          <strong>{nearestNode.name}</strong>
          <span>Distance: {minDistance} km</span>
          <span style={{ fontSize: '0.75rem', marginTop: '0.2rem', color: colors.primaryLight }}>⏱️ Updated: {nearestNode.lastUpdate || 'Just now'}</span>
        </NodeMetricBadge>
      </OverallStatusCard>

      {/* Trust-Aware "WHY?" Explanation Section */}
      <WhyExplanationCard>
        <h4>
          <MdCheckCircle style={{ color: nodeRisks.overallStatus === 'SAFE' ? colors.success : colors.warning }} /> 
          Why is {selectedArea} currently {nodeRisks.overallStatus === 'CRITICAL' ? 'under Critical Warning' : nodeRisks.overallStatus === 'WARNING' ? 'under Watch / Warning' : 'Safe'}?
        </h4>
        <div className="reasons">
          <div className="reason-item">
            <MdCheckCircle /> {nearestNode.online !== false ? 'IoT Sensor Station Healthy' : 'Sensor Telemetry Active'}
          </div>
          <div className="reason-item">
            <MdCheckCircle /> {nodeRisks.overallStatus === 'SAFE' ? 'No Abnormal Environmental Trends' : 'Elevated Telemetry Recorded'}
          </div>
          <div className="reason-item">
            <MdCheckCircle /> {nodeRisks.overallStatus === 'SAFE' ? 'Zero Active Hazard Events Nearby' : 'Proximity Warning Active'}
          </div>
        </div>
      </WhyExplanationCard>

      {/* Local Conditions Overview */}
      <SectionTitle>
        <span>Local Environmental Conditions</span>
        <span style={{ fontSize: '0.8rem', color: colors.textMuted, fontWeight: 400 }}>
          {selectedArea} Zone
        </span>
      </SectionTitle>

      <LiveSensorGrid>
        <SensorCard $danger={liveSensorData.temperature > 40 ? "true" : undefined}>
          <div className="card-top">
            <div className="icon-wrapper">
              <MdThermostat />
            </div>
            <span>Ambient Temperature</span>
          </div>
          <div className="value">
            {liveSensorData.temperature ?? 'N/A'} <span className="unit">°C</span>
          </div>
          <div className="status-row">
            <span className="standard">Optimal: 22-35°C</span>
            <span className="badge">{liveSensorData.temperature > 40 ? 'HIGH' : 'NORMAL'}</span>
          </div>
        </SensorCard>

        <SensorCard 
          $danger={(liveSensorData.mq2 ?? 0) >= 3150 ? "true" : undefined} 
          $warning={(liveSensorData.mq2 ?? 0) >= 3051 && (liveSensorData.mq2 ?? 0) < 3150 ? "true" : undefined}
        >
          <div className="card-top">
            <div className="icon-wrapper">
              <MdAir />
            </div>
            <span>Air Quality Index (MQ2)</span>
          </div>
          <div className="value">
            {liveSensorData.mq2 ?? 'N/A'} <span className="unit">PPM</span>
          </div>
          <div className="status-row">
            <span className="standard">Safe Threshold: &lt; 500</span>
            <span className="badge">
              {(liveSensorData.mq2 ?? 0) >= 3150 
                ? 'CRITICAL' 
                : (liveSensorData.mq2 ?? 0) >= 3051 
                ? 'WARNING' 
                : 'NORMAL'}
            </span>
          </div>
        </SensorCard>

        <SensorCard $danger={liveSensorData.vibration > 70 ? "true" : undefined}>
          <div className="card-top">
            <div className="icon-wrapper">
              <MdLandscape />
            </div>
            <span>Seismic / Vibration</span>
          </div>
          <div className="value">
            {liveSensorData.vibration ?? 'N/A'} <span className="unit">m/s²</span>
          </div>
          <div className="status-row">
            <span className="standard">Threshold: &lt; 50</span>
            <span className="badge">
              {liveSensorData.vibration > 70 ? 'RISK' : 'SAFE'}
            </span>
          </div>
        </SensorCard>

        <SensorCard>
          <div className="card-top">
            <div className="icon-wrapper">
              <MdOpacity />
            </div>
            <span>Relative Humidity</span>
          </div>
          <div className="value">
            {liveSensorData.humidity ?? 'N/A'} <span className="unit">%</span>
          </div>
          <div className="status-row">
            <span className="standard">Optimal: 40-75%</span>
            <span className="badge">NORMAL</span>
          </div>
        </SensorCard>

        <SensorCard 
          $danger={(liveSensorData.water_level ?? 50) > 80 || liveSensorData.water_level_condition === 'HIGH' ? "true" : undefined}
          $warning={(liveSensorData.water_level ?? 50) > 65 && (liveSensorData.water_level ?? 50) <= 80 ? "true" : undefined}
        >
          <div className="card-top">
            <div className="icon-wrapper">
              <MdWaves />
            </div>
            <span>Water Level</span>
          </div>
          <div className="value">
            {liveSensorData.water_level ?? 50} <span className="unit">%</span>
          </div>
          <div className="status-row">
            <span className="standard">Condition: {liveSensorData.water_level_condition || 'NORMAL'}</span>
            <span className="badge">
              {(liveSensorData.water_level ?? 50) > 80 || liveSensorData.water_level_condition === 'HIGH'
                ? 'HIGH RISK'
                : (liveSensorData.water_level ?? 50) > 65
                ? 'WARNING'
                : 'SAFE'}
            </span>
          </div>
        </SensorCard>

        <SensorCard 
          $danger={(liveSensorData.turbidity ?? 3400) < 1500 ? "true" : undefined}
          $warning={(liveSensorData.turbidity ?? 3400) >= 1500 && (liveSensorData.turbidity ?? 3400) < 3000 ? "true" : undefined}
        >
          <div className="card-top">
            <div className="icon-wrapper">
              <MdWaves />
            </div>
            <span>Water pH & Turbidity</span>
          </div>
          <div className="value">
            {liveSensorData.turbidity ?? 3400} <span className="unit">NTU</span>
          </div>
          <div className="status-row">
            <span className="standard">Standard: pH 6.5-8.5</span>
            <span className="badge">
              {(liveSensorData.turbidity ?? 3400) >= 3000 
                ? 'SAFE' 
                : (liveSensorData.turbidity ?? 3400) >= 1500 
                ? 'WARNING' 
                : 'UNSAFE'}
            </span>
          </div>
        </SensorCard>
      </LiveSensorGrid>

      {/* Multi-Module Live Structured Alert Cards */}
      <SectionTitle>
        <span>Environmental Threat Alerts & Structured Advisories</span>
        <span style={{ fontSize: '0.8rem', color: colors.textMuted, fontWeight: 400 }}>
          Live Telemetry Stream
        </span>
      </SectionTitle>

      <HazardsGrid>
        {hazardKeys.map((key) => (
          <PublicStructuredAlertCard
            key={key}
            hazardKey={key}
            hazardData={nodeRisks.hazards[key]}
            locationName={selectedArea}
            sensorData={liveSensorData}
            lastUpdate={nearestNode.lastUpdate}
            onInspect={(k) => setInspectModule(k)}
          />
        ))}
      </HazardsGrid>

      <QuickNavBanner to="/public/risks">
        <span>Check Nearby Risks & Distance Details</span>
        <MdArrowForward size={20} />
      </QuickNavBanner>

      {/* 7-Section Explainable Risk Inspection Modal */}
      {inspectModule && (
        <RiskEventDetailModal
          isOpen={!!inspectModule}
          onClose={() => setInspectModule(null)}
          moduleKey={inspectModule}
          locationName={selectedArea}
        />
      )}
    </Container>
  );
};

export default PublicDashboard;


