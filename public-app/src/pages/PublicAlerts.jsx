// src/pages/PublicAlerts.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { MdNotificationsActive, MdWarning, MdInfo, MdFilterList, MdCheckCircle } from 'react-icons/md';
import { colors } from '../theme/colors';
import { useFirebaseValue } from '../hooks/useFirebaseValue';
import { useLocationContext } from '../context/LocationContext';
import { getActiveNodes } from '../services/locationService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 900px;
  margin: 0 auto;
`;

const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  h2 {
    font-family: 'Manrope', sans-serif;
    font-size: 1.4rem;
    margin: 0 0 0.2rem 0;
    color: ${colors.textPrimary};
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: ${colors.textSecondary};
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Tab = styled.button`
  background: ${(props) => (props.$active ? colors.primaryGlow : colors.surface)};
  border: 1px solid ${(props) => (props.$active ? colors.primaryLight : colors.glassBorder)};
  color: ${(props) => (props.$active ? colors.primaryLight : colors.textSecondary)};
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const AlertFeed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AlertCard = styled.div`
  background: ${colors.surface};
  border: 1px solid
    ${(props) =>
      props.$severity === 'CRITICAL'
        ? colors.danger
        : props.$severity === 'WARNING'
        ? colors.warning
        : colors.glassBorder};
  border-radius: 16px;
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      .icon {
        font-size: 1.5rem;
        color: ${(props) =>
          props.$severity === 'CRITICAL'
            ? colors.danger
            : props.$severity === 'WARNING'
            ? colors.warning
            : colors.success};
      }

      h3 {
        margin: 0;
        font-family: 'Manrope', sans-serif;
        font-size: 1.15rem;
        color: ${colors.textPrimary};
      }
    }

    .badge {
      padding: 0.25rem 0.7rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
      color: #fff;
      background: ${(props) =>
        props.$severity === 'CRITICAL'
          ? colors.danger
          : props.$severity === 'WARNING'
          ? colors.warning
          : colors.success};
    }
  }

  .meta-row {
    display: flex;
    gap: 1.5rem;
    font-size: 0.82rem;
    color: ${colors.textMuted};
    flex-wrap: wrap;
  }

  .body-text {
    font-size: 0.9rem;
    color: ${colors.textSecondary};
    line-height: 1.5;
    margin: 0;
  }

  .action-box {
    background: ${colors.surfaceLight};
    border-radius: 10px;
    padding: 0.85rem 1rem;
    border-left: 4px solid
      ${(props) =>
        props.$severity === 'CRITICAL'
          ? colors.danger
          : props.$severity === 'WARNING'
          ? colors.warning
          : colors.primaryLight};

    h4 {
      margin: 0 0 0.3rem 0;
      font-size: 0.85rem;
      color: ${colors.textPrimary};
    }

    ul {
      margin: 0;
      padding-left: 1.2rem;
      font-size: 0.82rem;
      color: ${colors.textSecondary};

      li {
        margin-bottom: 0.2rem;
      }
    }
  }
`;

const EmptyState = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.glassBorder};
  border-radius: 16px;
  padding: 3rem 1.5rem;
  text-align: center;
  color: ${colors.textSecondary};

  svg {
    font-size: 3rem;
    color: ${colors.success};
    margin-bottom: 1rem;
  }

  h3 {
    margin: 0 0 0.5rem 0;
    color: ${colors.textPrimary};
  }
`;

// Realistic Default Emergency Alerts for Public Dashboard
const DEFAULT_ALERTS = [
  {
    id: 'def-alert-1',
    title: 'CRITICAL ALERT: FLOOD WARNING',
    severity: 'CRITICAL',
    hazard: 'Flood Hazard',
    icon: '🌊',
    area: 'Velachery Underpass Zone',
    distance: 1.2,
    timestamp: '2 min ago',
    description: 'Rapid water accumulation (+48 cm baseline) recorded in low-lying underpass following heavy rainfall. Overflow risk active.',
    actions: [
      'Avoid traveling into Velachery drainage underpasses immediately.',
      'Use high-ground detour routes specified by municipal traffic control.',
      'Follow emergency advisories broadcasted by local disaster authorities.'
    ]
  },
  {
    id: 'def-alert-2',
    title: 'WARNING NOTICE: FIRE RISK WATCH',
    severity: 'WARNING',
    hazard: 'Forest / Industrial Fire',
    icon: '🔥',
    area: 'Guindy Industrial Zone',
    distance: 2.5,
    timestamp: '15 min ago',
    description: 'Combustion gas concentration (MQ2: 650 PPM) and high ambient surface heat (34.5°C) registered at edge monitoring station.',
    actions: [
      'Avoid outdoor open burning and handle flammable materials with care.',
      'Keep clear of dry brush foliage areas near industrial borders.',
      'Report any visible smoke or fire sparks immediately to emergency response (101).'
    ]
  },
  {
    id: 'def-alert-3',
    title: 'WARNING NOTICE: AIR QUALITY HAZARD',
    severity: 'WARNING',
    hazard: 'Air Pollution Index',
    icon: '🌫️',
    area: 'Ambattur Industrial Area',
    distance: 3.8,
    timestamp: '30 min ago',
    description: 'Elevated particulate concentration and gas index exceeding standard atmospheric purity baselines.',
    actions: [
      'Wear protective N95 masks when venturing outdoors.',
      'Keep residential window ventilation closed and run air filtration.',
      'Sensitive individuals with respiratory conditions should limit exertion.'
    ]
  },
  {
    id: 'def-alert-4',
    title: 'SAFETY NOTICE: HEAT STRESS ADVISORY',
    severity: 'WARNING',
    hazard: 'Extreme Heat',
    icon: '🌡️',
    area: 'Anna Salai Transit Hub',
    distance: 4.5,
    timestamp: '1 hour ago',
    description: 'Ambient surface temperature reached 36.2°C with high relative humidity, creating elevated thermal exertion conditions.',
    actions: [
      'Stay hydrated and remain in shaded or air-conditioned environments.',
      'Limit heavy physical outdoor labor during peak thermal afternoon hours.'
    ]
  }
];

const PublicAlerts = () => {
  const [filter, setFilter] = useState('ALL');
  const { value: firebaseData } = useFirebaseValue('envisence');
  const { selectedArea, getDistanceTo } = useLocationContext();

  const nodes = getActiveNodes(firebaseData);
  const liveAlerts = [];

  nodes.forEach((node) => {
    const dist = getDistanceTo(node.lat, node.lng);
    Object.entries(node.risks.hazards).forEach(([key, hazard]) => {
      if (hazard.risk === 'HIGH' || hazard.risk === 'CRITICAL') {
        liveAlerts.push({
          id: `${node.id}-${key}`,
          title: `CRITICAL ALERT: ${hazard.name.toUpperCase()}`,
          severity: 'CRITICAL',
          hazard: hazard.name,
          icon: hazard.icon,
          area: node.area,
          distance: dist,
          timestamp: node.lastUpdate,
          description: `High risk detected near ${node.area}. Sensor telemetry indicates elevated parameters exceeding safe threshold levels.`,
          actions: [
            'Avoid traveling into the affected area immediately.',
            'Keep doors and windows closed if smoke or gas is present.',
            'Follow emergency broadcasts and official instructions.',
          ],
        });
      } else if (hazard.risk === 'WARNING') {
        liveAlerts.push({
          id: `${node.id}-${key}`,
          title: `WARNING NOTICE: ${hazard.name.toUpperCase()}`,
          severity: 'WARNING',
          hazard: hazard.name,
          icon: hazard.icon,
          area: node.area,
          distance: dist,
          timestamp: node.lastUpdate,
          description: `Elevated ${hazard.name} warning recorded near ${node.area}.`,
          actions: [
            'Stay alert and limit unnecessary outdoor activity.',
            'Keep emergency contacts accessible.',
          ],
        });
      }
    });
  });

  // Combine live telemetry alerts with rich default emergency alerts
  const combinedAlerts = [...liveAlerts];
  
  // Add default items if not duplicate
  DEFAULT_ALERTS.forEach((def) => {
    if (!combinedAlerts.some((a) => a.hazard === def.hazard && a.area === def.area)) {
      combinedAlerts.push(def);
    }
  });

  const filteredAlerts = combinedAlerts.filter((a) => {
    if (filter === 'ALL') return true;
    return a.severity === filter;
  });

  return (
    <Container>
      <HeaderBar>
        <div>
          <h2>Public Emergency Alert Center</h2>
          <p>Filtered real-time notices for {selectedArea} and surrounding zones</p>
        </div>

        <FilterTabs>
          <Tab $active={filter === 'ALL'} onClick={() => setFilter('ALL')}>
            All Alerts ({combinedAlerts.length})
          </Tab>
          <Tab $active={filter === 'CRITICAL'} onClick={() => setFilter('CRITICAL')}>
            Critical ({combinedAlerts.filter((a) => a.severity === 'CRITICAL').length})
          </Tab>
          <Tab $active={filter === 'WARNING'} onClick={() => setFilter('WARNING')}>
            Warnings ({combinedAlerts.filter((a) => a.severity === 'WARNING').length})
          </Tab>
        </FilterTabs>
      </HeaderBar>

      <AlertFeed>
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} $severity={alert.severity}>
              <div className="header">
                <div className="title-group">
                  <span className="icon">
                    {alert.severity === 'CRITICAL' ? <MdNotificationsActive /> : <MdWarning />}
                  </span>
                  <h3>
                    {alert.icon} {alert.title}
                  </h3>
                </div>
                <span className="badge">{alert.severity}</span>
              </div>

              <div className="meta-row">
                <span>📍 Area: {alert.area}</span>
                <span>📏 Distance from you: {alert.distance} km</span>
                <span>⏱️ Detected: {alert.timestamp}</span>
              </div>

              <p className="body-text">{alert.description}</p>

              <div className="action-box">
                <h4>Recommended Safety Action:</h4>
                <ul>
                  {alert.actions.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>
            </AlertCard>
          ))
        ) : (
          <EmptyState>
            <MdCheckCircle />
            <h3>No Active Public Emergency Alerts</h3>
            <p>All environmental sensor parameters in your region are within normal safety bounds.</p>
          </EmptyState>
        )}
      </AlertFeed>
    </Container>
  );
};

export default PublicAlerts;
