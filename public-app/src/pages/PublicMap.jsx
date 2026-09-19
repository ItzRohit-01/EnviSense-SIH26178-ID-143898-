// src/pages/PublicMap.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { colors } from '../theme/colors';
import { useFirebaseValue } from '../hooks/useFirebaseValue';
import { getActiveNodes } from '../services/locationService';
import { useLocationContext } from '../context/LocationContext';
import { MdFilterList, MdMyLocation } from 'react-icons/md';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 140px);
  gap: 1rem;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: thin;
`;

const FilterChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  border: 1px solid ${(props) => (props.$active ? colors.primaryLight : colors.glassBorder)};
  background: ${(props) => (props.$active ? colors.primaryGlow : colors.surface)};
  color: ${(props) => (props.$active ? colors.primaryLight : colors.textSecondary)};
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${colors.primaryLight};
    color: ${colors.textPrimary};
  }
`;

const MapWrapper = styled.div`
  flex: 1;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${colors.glassBorder};
  position: relative;

  .leaflet-container {
    height: 100%;
    width: 100%;
    background: #0A0F0D;
  }
`;

const UserLocBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  background: ${colors.surface};
  border: 1px solid ${colors.glassBorder};
  backdrop-filter: blur(8px);
  padding: 0.5rem 1rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${colors.textPrimary};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  svg {
    color: ${colors.primaryLight};
  }
`;

const PopupContent = styled.div`
  padding: 0.25rem;
  color: #0f172a;

  h4 {
    margin: 0 0 0.3rem 0;
    font-size: 1rem;
    color: #0f172a;
    font-weight: 700;
  }

  p {
    margin: 0.2rem 0;
    font-size: 0.82rem;
  }

  .badge {
    display: inline-block;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 700;
    margin-bottom: 0.4rem;
    color: #fff;
    background: ${(props) =>
      props.$risk === 'HIGH' || props.$risk === 'CRITICAL'
        ? '#ef4444'
        : props.$risk === 'WARNING'
        ? '#f59e0b'
        : '#10b981'};
  }

  .advice {
    margin-top: 0.5rem;
    padding: 0.4rem;
    background: #f1f5f9;
    border-radius: 6px;
    font-size: 0.78rem;
    font-weight: 600;
    color: #334155;
  }
`;

// Helper to create custom Leaflet Icon
const createCustomIcon = (risk) => {
  const color = risk === 'HIGH' || risk === 'CRITICAL' ? '#ef4444' : risk === 'WARNING' ? '#f59e0b' : '#10b981';
  const html = `<div style="
    background-color: ${color};
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 3px solid #ffffff;
    box-shadow: 0 0 12px ${color};
  "></div>`;
  return L.divIcon({ html, className: '', iconSize: [22, 22] });
};

const createUserLocationIcon = () => {
  const html = `<div style="
    background-color: #3b82f6;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 3px solid #ffffff;
    box-shadow: 0 0 14px #3b82f6;
  "></div>`;
  return L.divIcon({ html, className: '', iconSize: [20, 20] });
};

const HAZARDS_FILTER = [
  { id: 'ALL', label: 'All Hazards', icon: '🌐' },
  { id: 'forest_fire', label: 'Forest Fire', icon: '🔥' },
  { id: 'extreme_heat', label: 'Extreme Heat', icon: '🌡️' },
  { id: 'flood', label: 'Flood', icon: '🌊' },
  { id: 'landslide', label: 'Landslide', icon: '⛰️' },
  { id: 'air_quality', label: 'Air Quality', icon: '🌫️' },
  { id: 'water_quality', label: 'Water Quality', icon: '💧' },
  { id: 'industrial', label: 'Industrial', icon: '🏭' },
];

const PublicMap = () => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const { value: firebaseData } = useFirebaseValue('envisence');
  const { selectedArea, userLocation, getDistanceTo } = useLocationContext();

  const nodes = getActiveNodes(firebaseData);

  const filteredNodes = nodes.filter((node) => {
    if (activeFilter === 'ALL') return true;
    const hazard = node.risks.hazards[activeFilter];
    return hazard && hazard.risk !== 'SAFE';
  });

  const mapCenter = nodes.length > 0 ? [nodes[0].lat, nodes[0].lng] : [userLocation.lat, userLocation.lng];

  return (
    <Container>
      <FilterBar>
        <span style={{ fontSize: '0.85rem', color: colors.textMuted, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <MdFilterList /> Filter:
        </span>
        {HAZARDS_FILTER.map((f) => (
          <FilterChip
            key={f.id}
            $active={activeFilter === f.id}
            onClick={() => setActiveFilter(f.id)}
          >
            <span>{f.icon}</span> {f.label}
          </FilterChip>
        ))}
      </FilterBar>

      <MapWrapper>
        <UserLocBadge>
          <MdMyLocation /> Selected Location: <strong>{selectedArea}</strong>
        </UserLocBadge>

        <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* User Location Marker (Blue Dot) */}
          <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserLocationIcon()}>
            <Popup>
              <PopupContent $risk="SAFE">
                <h4>🔵 Your Location ({selectedArea})</h4>
                <p>Selected Monitoring Zone</p>
              </PopupContent>
            </Popup>
          </Marker>

          {/* Sensor Nodes */}
          {filteredNodes.map((node) => {
            const distance = getDistanceTo(node.lat, node.lng);
            const overallRisk = node.risks.overallStatus;

            return (
              <React.Fragment key={node.id}>
                <Marker position={[node.lat, node.lng]} icon={createCustomIcon(overallRisk)}>
                  <Popup>
                    <PopupContent $risk={overallRisk}>
                      <span className="badge">{overallRisk} RISK</span>
                      <h4>{node.name}</h4>
                      <p>📍 Area: {node.area}</p>
                      <p>📏 Distance: <strong>{distance} km away</strong></p>
                      <p>⏱️ Last update: {node.lastUpdate}</p>
                      <div className="advice">
                        {overallRisk === 'HIGH' || overallRisk === 'CRITICAL'
                          ? '⚠️ High hazard level! Avoid nearest affected zone and stay tuned to emergency broadcasts.'
                          : overallRisk === 'WARNING'
                          ? '⚡ Moderate alert. Take precautions and avoid prolonged outdoor exposure.'
                          : '✅ Area is clear and under normal automated sensor monitoring.'}
                      </div>
                    </PopupContent>
                  </Popup>
                </Marker>

                {overallRisk !== 'SAFE' && (
                  <Circle
                    center={[node.lat, node.lng]}
                    radius={overallRisk === 'HIGH' ? 1800 : 1000}
                    pathOptions={{
                      color: overallRisk === 'HIGH' ? '#ef4444' : '#f59e0b',
                      fillColor: overallRisk === 'HIGH' ? '#ef4444' : '#f59e0b',
                      fillOpacity: 0.15,
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </MapContainer>
      </MapWrapper>
    </Container>
  );
};

export default PublicMap;
