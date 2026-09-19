import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { MdCheckCircle, MdNotificationsActive, MdFilterList, MdAssignmentInd, MdCheck } from 'react-icons/md';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { useFirebaseValue } from '../hooks/useFirebaseValue';
import { colors } from '../theme/colors';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  h2 {
    font-family: 'Manrope', sans-serif;
    font-size: 1.4rem;
    margin: 0;
    color: ${colors.textPrimary};
  }

  p {
    margin: 0.25rem 0 0;
    font-size: 0.85rem;
    color: ${colors.textSecondary};
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterBtn = styled.button`
  background: ${({ $active }) => ($active ? colors.primaryGlow : colors.surface)};
  color: ${({ $active }) => ($active ? colors.primaryLight : colors.textSecondary)};
  border: 1px solid ${({ $active }) => ($active ? colors.primaryLight : colors.glassBorder)};
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.surfaceLight};
    color: ${colors.textPrimary};
  }
`;

const AlertGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
`;

const AlertCard = styled(Card)`
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-left: 4px solid ${({ status }) =>
    status === 'SAFE'
      ? colors.success
      : status === 'WARNING'
      ? colors.warning
      : colors.danger};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
  color: ${colors.textSecondary};
  margin-bottom: 0.4rem;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 0.85rem;
  border-top: 1px solid ${colors.glassBorder};
`;

const ActionBtn = styled.button`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.45rem 0.65rem;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${colors.glassBorder};
  background: ${colors.surfaceLight};
  color: ${colors.textPrimary};
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.primaryGlow};
    color: ${colors.primaryLight};
    border-color: ${colors.primaryLight};
  }
`;

const AlertSystem = () => {
  const { value: fire } = useFirebaseValue('/envisence/live/forest_fire');
  const { value: flood } = useFirebaseValue('/envisence/live/flood');
  const { value: heat } = useFirebaseValue('/envisence/live/extreme_heat');
  const { value: landslide } = useFirebaseValue('/envisence/live/landslide');
  const { value: airQuality } = useFirebaseValue('/envisence/live/air_quality');
  const { value: water } = useFirebaseValue('/envisence/live/water_quality');
  
  // also grab raw sensors for accurate trigger metrics
  const { value: sensors } = useFirebaseValue('/envisence/live/sensors');

  const [lifecycleState, setLifecycleState] = useState({});
  const [filter, setFilter] = useState('ALL');

  const baseAlerts = [
    { id: 'fire', name: '🔥 Forest Fire', status: fire?.status || 'SAFE', node: 'NODE_001', ai: fire?.ai_prediction, value: `${sensors?.mq2_raw ?? 'N/A'} PPM` },
    { id: 'flood', name: '🌊 Flood Risk', status: flood?.status || 'SAFE', node: 'NODE_001', ai: flood?.ai_prediction || 'Normal Water Level', value: `${sensors?.water_level_condition ?? 'N/A'}` },
    { id: 'heat', name: '🌡️ Extreme Heat', status: heat?.status || 'SAFE', node: 'NODE_001', ai: heat?.ai_prediction, value: `${sensors?.temperature ?? 'N/A'} °C` },
    { id: 'landslide', name: '⛰️ Landslide Risk', status: landslide?.status || 'SAFE', node: 'NODE_001', ai: landslide?.ai_prediction || 'Vibration Stable', value: `Vib: ${sensors?.vibration_raw ?? 'N/A'} | Soil: ${sensors?.soil_moisture_raw ?? 'N/A'} RAW` },
    { id: 'air', name: '🌫️ Air Pollution', status: airQuality?.status || 'SAFE', node: 'NODE_001', ai: airQuality?.ai_prediction, value: `${sensors?.mq2_raw ?? 'N/A'} PPM` },
    { id: 'water', name: '💧 Water Quality', status: water?.status || 'SAFE', node: 'NODE_001', ai: water?.ai_prediction, value: `pH ${sensors?.ph_raw ?? 'N/A'}` },
  ];

  const handleAction = (id, newLifecycle) => {
    setLifecycleState((prev) => ({ ...prev, [id]: newLifecycle }));
  };

  const formattedAlerts = baseAlerts.map((a) => ({
    ...a,
    lifecycle: lifecycleState[a.id] || (a.status === 'SAFE' ? 'RESOLVED' : 'ACTIVE'),
  }));

  const filtered = formattedAlerts.filter((a) => {
    if (filter === 'ALL') return true;
    return a.lifecycle === filter;
  });

  return (
    <Container>
      <Header>
        <div>
          <h2>Authority Alert Management</h2>
          <p>Real-time threat monitoring and response workflow dispatcher</p>
        </div>
        <FilterGroup>
          <FilterBtn $active={filter === 'ALL'} onClick={() => setFilter('ALL')}>All Alerts</FilterBtn>
          <FilterBtn $active={filter === 'ACTIVE'} onClick={() => setFilter('ACTIVE')}>🚨 Active</FilterBtn>
          <FilterBtn $active={filter === 'ACKNOWLEDGED'} onClick={() => setFilter('ACKNOWLEDGED')}>👁️ Acknowledged</FilterBtn>
          <FilterBtn $active={filter === 'RESOLVED'} onClick={() => setFilter('RESOLVED')}>✅ Resolved</FilterBtn>
        </FilterGroup>
      </Header>

      <AlertGrid>
        {filtered.map((alert) => (
          <AlertCard key={alert.id} status={alert.status}>
            <div>
              <CardHeader>
                <CardTitle>{alert.name}</CardTitle>
                <StatusBadge status={alert.status}>{alert.status}</StatusBadge>
              </CardHeader>

              <DetailRow>
                <span>Monitoring Node</span>
                <strong style={{ color: colors.primaryLight }}>{alert.node}</strong>
              </DetailRow>

              <DetailRow>
                <span>Trigger Metric</span>
                <strong style={{ color: colors.textPrimary }}>{alert.value}</strong>
              </DetailRow>

              {alert.ai && (
                <DetailRow>
                  <span>AI Insight</span>
                  <span style={{ color: colors.accentYellow }}>{alert.ai}</span>
                </DetailRow>
              )}

              <DetailRow style={{ marginTop: '0.4rem' }}>
                <span>Workflow State</span>
                <strong style={{ color: alert.lifecycle === 'RESOLVED' ? colors.success : colors.warning }}>
                  {alert.lifecycle}
                </strong>
              </DetailRow>
            </div>

            <ActionRow>
              {alert.lifecycle !== 'ACKNOWLEDGED' && alert.lifecycle !== 'RESOLVED' && (
                <ActionBtn onClick={() => handleAction(alert.id, 'ACKNOWLEDGED')}>
                  <MdCheck /> Acknowledge
                </ActionBtn>
              )}
              {alert.lifecycle !== 'RESOLVED' && (
                <ActionBtn onClick={() => handleAction(alert.id, 'RESOLVED')}>
                  <MdCheckCircle /> Resolve Alert
                </ActionBtn>
              )}
              {alert.lifecycle === 'RESOLVED' && (
                <ActionBtn onClick={() => handleAction(alert.id, 'ACTIVE')}>
                  Re-Open Alert
                </ActionBtn>
              )}
            </ActionRow>
          </AlertCard>
        ))}
      </AlertGrid>
    </Container>
  );
};

export default AlertSystem;

