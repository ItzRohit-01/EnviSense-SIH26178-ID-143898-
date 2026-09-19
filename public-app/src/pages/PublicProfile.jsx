// src/pages/PublicProfile.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors } from '../theme/colors';
import { useLocationContext } from '../context/LocationContext';
import { getActiveNodes } from '../services/locationService';
import { useFirebaseValue } from '../hooks/useFirebaseValue';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import {
  MdShield, MdLocationOn, MdGpsFixed, MdAdd, MdDelete,
  MdNotifications, MdVolumeUp, MdSecurity, MdPhoneInTalk,
  MdLanguage, MdSensors, MdCheck
} from 'react-icons/md';
import 'leaflet/dist/leaflet.css';

const MapWrapper = styled.div`
  width: 100%;
  height: 300px;
  margin: 1rem 0;
  border: 1px solid ${colors.glassBorder};
  border-radius: 12px;
  overflow: hidden;
`;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 980px;
  margin: 0 auto;
  padding-bottom: 3rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;

  div {
    h2 {
      font-family: 'Manrope', sans-serif;
      font-size: 1.6rem;
      margin: 0 0 0.25rem 0;
      color: ${colors.textPrimary};
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    p {
      margin: 0;
      font-size: 0.88rem;
      color: ${colors.textSecondary};
    }
  }
`;

const SectionCard = styled.div`
  background: ${colors.surface};
  border: 1px solid ${(props) => (props.$highContrast ? '#38bdf8' : colors.glassBorder)};
  border-radius: 18px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  h3 {
    margin: 0;
    font-family: 'Manrope', sans-serif;
    font-size: ${(props) => (props.$largeText ? '1.3rem' : '1.15rem')};
    color: ${colors.textPrimary};
    display: flex;
    align-items: center;
    gap: 0.55rem;

    svg {
      color: ${colors.primaryLight};
    }
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const SafetyBanner = styled.div`
  padding: 1.1rem 1.3rem;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${(props) =>
    props.$status === 'CRITICAL'
      ? 'rgba(239, 68, 68, 0.15)'
      : props.$status === 'WARNING'
        ? 'rgba(245, 158, 11, 0.15)'
        : 'rgba(16, 185, 129, 0.15)'};
  border: 1px solid
    ${(props) =>
    props.$status === 'CRITICAL'
      ? colors.danger
      : props.$status === 'WARNING'
        ? colors.warning
        : colors.success};

  .text {
    h4 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 800;
      color: ${(props) =>
    props.$status === 'CRITICAL'
      ? colors.danger
      : props.$status === 'WARNING'
        ? colors.warning
        : colors.success};
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    p {
      margin: 0.3rem 0 0 0;
      font-size: 0.85rem;
      color: ${colors.textSecondary};
    }
  }
`;

const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid ${colors.glassBorder};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  label {
    font-size: ${(props) => (props.$largeText ? '1.05rem' : '0.9rem')};
    font-weight: 600;
    color: ${colors.textPrimary};

    span {
      display: block;
      font-size: ${(props) => (props.$largeText ? '0.88rem' : '0.78rem')};
      font-weight: 400;
      color: ${colors.textMuted};
      margin-top: 0.15rem;
    }
  }

  select,
  input[type='text'],
  input[type='range'] {
    background: ${colors.surfaceLight};
    border: 1px solid ${colors.glassBorder};
    color: ${colors.textPrimary};
    padding: 0.5rem 0.85rem;
    border-radius: 8px;
    outline: none;
    font-size: 0.88rem;

    &:focus {
      border-color: ${colors.primaryLight};
    }
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.95rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${(props) => (props.$primary ? colors.primaryLight : colors.glassBorder)};
  background: ${(props) => (props.$primary ? colors.primaryGlow : colors.surfaceLight)};
  color: ${(props) => (props.$primary ? colors.primaryLight : colors.textPrimary)};
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$primary ? colors.primaryLight : colors.surface)};
    color: ${(props) => (props.$primary ? '#000' : colors.primaryLight)};
  }
`;

const RadiusOptions = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
`;

const RadiusPill = styled.button`
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  background: ${(props) => (props.$active ? colors.primaryGlow : colors.surfaceLight)};
  color: ${(props) => (props.$active ? colors.primaryLight : colors.textSecondary)};
  border: 1px solid ${(props) => (props.$active ? colors.primaryLight : colors.glassBorder)};
  transition: all 0.2s ease;
`;

const ToggleSwitch = styled.button`
  width: 46px;
  height: 24px;
  border-radius: 999px;
  border: none;
  background: ${(props) => (props.$on ? colors.success : colors.surfaceLight)};
  position: relative;
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${(props) => (props.$on ? '24px' : '2px')};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    transition: left 0.2s ease;
  }
`;

const CheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
`;

const CheckboxCard = styled.label`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  background: ${colors.surfaceLight};
  border: 1px solid ${colors.glassBorder};
  font-size: 0.88rem;
  color: ${colors.textPrimary};
  cursor: pointer;

  input {
    accent-color: ${colors.primaryLight};
    width: 16px;
    height: 16px;
  }
`;

const SavedPlaceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

const SavedPlaceItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background: ${colors.surfaceLight};
  border: 1px solid ${colors.glassBorder};

  .place-info {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    font-size: 0.9rem;
    font-weight: 600;

    span {
      font-size: 0.78rem;
      color: ${colors.textMuted};
      font-weight: 400;
      margin-left: 0.4rem;
    }
  }
`;

const AddPlaceForm = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;

  input,
  select {
    flex: 1;
    min-width: 130px;
  }
`;

const Toast = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: ${colors.primaryGlow};
  border: 1px solid ${colors.primaryLight};
  color: ${colors.primaryLight};
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 600;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 1000;
`;

const HardwareGaugesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.85rem;
`;

const HardwareCard = styled.div`
  padding: 0.95rem;
  border-radius: 12px;
  background: ${colors.surfaceLight};
  border: 1px solid ${colors.glassBorder};

  .metric-name {
    font-size: 0.8rem;
    color: ${colors.textMuted};
    font-weight: 500;
  }

  .metric-val {
    font-size: 1.3rem;
    font-weight: 800;
    color: ${colors.textPrimary};
    margin: 0.25rem 0;
  }

  .metric-status {
    font-size: 0.75rem;
    font-weight: 700;
    color: ${(props) => (props.$danger ? colors.danger : colors.success)};
  }
`;

// Multi-Language Labels
const I18N = {
  EN: {
    title: 'Personal Safety Control Center',
    subtitle: 'Public interactive hazard triggers, live ESP32 telemetry, and location controls',
    sec1: '1. Location & Monitored Places',
    sec2: '2. Alert & Trigger Preferences',
    sec3: '3. Local Safety & Alert History',
    sec4: '4. Personalization & Accessibility',
    sec5: '5. Live ESP32 Hardware Telemetry',
    safe: '🟢 YOU ARE SAFE',
    warning: '🟠 WARNING NEARBY',
    danger: '🔴 CRITICAL HAZARD DETECTED',
  },
  TA: {
    title: 'தனிப்பட்ட பாதுகாப்பு கட்டுப்பாட்டு மையம்',
    subtitle: 'நிகழ்நேர ESP32 சென்சார் அளவீடுகள் மற்றும் ஆபத்து எச்சரிக்கை அமைப்புகள்',
    sec1: '1. இருப்பிடம் மற்றும் கண்காணிப்பு பகுதிகள்',
    sec2: '2. எச்சரிக்கை மற்றும் தூண்டுதல் அமைப்புகள்',
    sec3: '3. நேரலை பாதுகாப்பு நிலை மற்றும் வரலாறு',
    sec4: '4. அணுகல்தன்மை மற்றும் மொழி',
    sec5: '5. நேரலை ESP32 வன்பொருள் அளவீடுகள்',
    safe: '🟢 நீங்கள் பாதுகாப்பாக உள்ளீர்கள்',
    warning: '🟠 அருகில் எச்சரிக்கை நிலவுகிறது',
    danger: '🔴 தீவிர ஆபத்து கண்டறியப்பட்டது',
  },
  HI: {
    title: 'व्यक्तिगत सुरक्षा नियंत्रण केंद्र',
    subtitle: 'लाइव ESP32 सेंसर मेट्रिक्स और खतरा चेतावनी सेटिंग्स',
    sec1: '1. स्थान और निगरानी क्षेत्र',
    sec2: '2. चेतावनी और ट्रिगर प्राथमिकताएं',
    sec3: '3. लाइव सुरक्षा स्थिति और इतिहास',
    sec4: '4. सुगमता और भाषा पसंद',
    sec5: '5. लाइव ESP32 हार्डवेयर सेंसर',
    safe: '🟢 आप सुरक्षित हैं',
    warning: '🟠 पास में चेतावनी',
    danger: '🔴 गंभीर खतरा पाया गया',
  },
};

const PublicProfile = () => {
  const { selectedArea, userLocation, presetLocations, setAreaByName, useCurrentLocation, getDistanceTo } = useLocationContext();

  // Firebase Live Sensor Stream
  const { value: firebaseData } = useFirebaseValue('envisence');
  const activeNodes = getActiveNodes(firebaseData);
  const liveNode = activeNodes && activeNodes.length > 0 ? activeNodes[0] : null;

  // ── ALL HOOKS MUST BE BEFORE ANY CONDITIONAL RETURN (Rules of Hooks) ──
  // UI Interactive States
  const [toastMsg, setToastMsg] = useState(null);
  const [radius, setRadius] = useState('10');
  const [savedPlaces, setSavedPlaces] = useState([
    { id: '1', icon: '🏠', label: 'Home', area: 'Velachery' },
    { id: '2', icon: '🏫', label: 'College', area: 'Guindy' },
    { id: '3', icon: '💼', label: 'Workplace', area: 'Adyar' },
  ]);
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceArea, setNewPlaceArea] = useState('Velachery');
  const [newPlaceType, setNewPlaceType] = useState('🏠');

  // Alert Triggers
  const [hazards, setHazards] = useState({ fire: false, flood: false, heat: false, air: false, landslide: false, water: false, industrial: false });
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [notifs, setNotifs] = useState(true);
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [voiceAlert, setVoiceAlert] = useState(false);

  // Personalization & Accessibility
  const [lang, setLang] = useState('EN');
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Guard against missing Firebase data — placed AFTER all hooks
  if (!liveNode) {
    return (
      <Container>
        <Header>
          <div>
            <h2><MdShield style={{ color: colors.primaryLight }} /> Loading sensor data…</h2>
            <p>Connecting to Firebase live stream. Please wait.</p>
          </div>
        </Header>
      </Container>
    );
  }

  const t = I18N[lang] || I18N.EN;

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Add / Remove Places
  const addPlace = () => {
    if (!newPlaceName.trim()) return;
    setSavedPlaces([
      ...savedPlaces,
      { id: Date.now().toString(), icon: newPlaceType, label: newPlaceName.trim(), area: newPlaceArea },
    ]);
    setNewPlaceName('');
    triggerToast('New place added to active session!');
  };

  const removePlace = (id) => {
    setSavedPlaces(savedPlaces.filter((p) => p.id !== id));
    triggerToast('Place removed.');
  };

  // Toggle Hazard Subscription
  const toggleHazard = (key) => {
    setHazards({ ...hazards, [key]: !hazards[key] });
    triggerToast('Subscribed hazard checklist updated.');
  };

  // Voice Alert Test
  const testVoiceAlert = () => {
    if ('speechSynthesis' in window) {
      const msgText = `Live Environmental Alert for ${selectedArea}. ESP32 Temperature is ${liveNode.sensors.temperature} degrees Celsius, MQ2 Gas is ${liveNode.sensors.mq2} PPM.`;
      const utterance = new SpeechSynthesisUtterance(msgText);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
      triggerToast('Broadcasting live hardware voice announcement...');
    } else {
      triggerToast('Speech synthesis not supported on this browser.');
    }
  };

  // Live Location & Safety Calculation
  const nearestDist = getDistanceTo(liveNode.lat, liveNode.lng);
  const isWithinRadius = nearestDist <= parseFloat(radius);
  const currentOverall = liveNode.risks.overallStatus;
  // Updated safety state handling
  const safetyState = currentOverall;

  return (
    <Container>
      <Header>
        <div>
          <h2>
            <MdShield style={{ color: colors.primaryLight }} /> {t.title}
          </h2>
          <p>{t.subtitle}</p>
        </div>
      </Header>

      {/* SECTION 1: LOCATION & MONITORED PLACES */}
      <SectionCard id="sec-location" $highContrast={highContrast} $largeText={largeText}>
        <SectionHeader>
          <h3>
            <MdLocationOn /> {t.sec1}
          </h3>
          <Button $primary onClick={useCurrentLocation}>
            <MdGpsFixed /> Use My GPS
          </Button>
        </SectionHeader>

        {/* Live Safety Callout - Displays current safety status and last update time */}
        <SafetyBanner $status={safetyState}>
          <div className="text">
            <h4>
              {safetyState === 'SAFE' && (t.safe || '🟢 YOU ARE SAFE')}
              {safetyState === 'WARNING' && t.warning}
              {(safetyState === 'CRITICAL' || safetyState === 'HIGH') && t.danger}
            </h4>
            <p>
              Selected Zone: <strong>{selectedArea}</strong> • Nearest ESP32 Hardware Station: <strong>{liveNode.name} ({nearestDist} km away)</strong> • Updated: <strong>{liveNode.lastUpdate || 'Just now'}</strong>
            </p>
          </div>
        </SafetyBanner>
        <MapWrapper>
          <MapContainer center={[userLocation?.lat || liveNode.lat, userLocation?.lng || liveNode.lng]} zoom={13} style={{ height: '300px', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />

            {/* User Selected Location Marker (Blue Dot) */}
            <Marker 
              position={[userLocation?.lat || liveNode.lat, userLocation?.lng || liveNode.lng]}
              icon={L.divIcon({
                className: '',
                iconSize: [20, 20],
                html: `<div style="
                  background-color: #3b82f6;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  border: 3px solid #ffffff;
                  box-shadow: 0 0 14px #3b82f6;
                "></div>`
              })}
            >
              <Popup>
                <div style={{ color: '#0f172a' }}>
                  <strong>🔵 Your Location ({selectedArea})</strong><br />
                  Selected Primary Zone
                </div>
              </Popup>
            </Marker>

            {/* Hardware Node Marker (Green/Yellow/Red Dot) */}
            <Marker 
              position={[liveNode.lat, liveNode.lng]}
              icon={L.divIcon({
                className: '',
                iconSize: [22, 22],
                html: `<div style="
                  background-color: ${liveNode.risks.overallStatus === 'SAFE' ? '#10b981' : liveNode.risks.overallStatus === 'WARNING' ? '#f59e0b' : '#ef4444'};
                  width: 22px;
                  height: 22px;
                  border-radius: 50%;
                  border: 3px solid #ffffff;
                  box-shadow: 0 0 14px ${liveNode.risks.overallStatus === 'SAFE' ? '#10b981' : liveNode.risks.overallStatus === 'WARNING' ? '#f59e0b' : '#ef4444'};
                "></div>`
              })}
            >
              <Popup>
                <div style={{ color: '#0f172a' }}>
                  <strong>📡 {liveNode.name}</strong><br />
                  Location: {liveNode.area}<br />
                  Overall Risk: <strong>{liveNode.risks.overallStatus}</strong>
                </div>
              </Popup>
            </Marker>

            <Circle
              center={[liveNode.lat, liveNode.lng]}
              radius={parseFloat(radius) * 1000}
              pathOptions={{ color: liveNode.risks.overallStatus === 'SAFE' ? colors.success : liveNode.risks.overallStatus === 'WARNING' ? colors.warning : colors.danger, fillOpacity: 0.1 }}
            />
          </MapContainer>
        </MapWrapper>

        <FormGrid>
          <FormRow $largeText={largeText}>
            <label>
              Primary Monitoring Area
              <span>Select location to measure live proximity to hardware nodes</span>
            </label>
            <select value={selectedArea} onChange={(e) => setAreaByName(e.target.value)}>
              {presetLocations.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name} ({loc.area})
                </option>
              ))}
            </select>
          </FormRow>

          <FormRow $largeText={largeText}>
            <label>
              Alert Radius Filter ({radius} km)
              <span>
                {isWithinRadius
                  ? `✅ Node (${nearestDist} km) is WITHIN your ${radius} km alert radius`
                  : `ℹ️ Node (${nearestDist} km) is OUTSIDE your ${radius} km alert radius`}
              </span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
              <RadiusOptions>
                {['1', '5', '10', '25', '50'].map((r) => (
                  <RadiusPill key={r} $active={radius === r} onClick={() => setRadius(r)}>
                    {r} km
                  </RadiusPill>
                ))}
              </RadiusOptions>
              <input
                type="range"
                min="1"
                max="50"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                style={{ width: '200px' }}
              />
            </div>
          </FormRow>

          <div style={{ marginTop: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: colors.textPrimary, display: 'block', marginBottom: '0.6rem' }}>
              🏠 Saved Key Locations (Interactive Session)
            </label>
            <SavedPlaceList>
              {savedPlaces.map((place) => (
                <SavedPlaceItem key={place.id}>
                  <div className="place-info">
                    {place.icon} <strong>{place.label}</strong>
                    <span>({place.area})</span>
                  </div>
                  <Button onClick={() => removePlace(place.id)}>
                    <MdDelete style={{ color: colors.danger }} /> Remove
                  </Button>
                </SavedPlaceItem>
              ))}
            </SavedPlaceList>

            <AddPlaceForm>
              <select value={newPlaceType} onChange={(e) => setNewPlaceType(e.target.value)} style={{ flex: '0.4' }}>
                <option value="🏠">🏠 Home</option>
                <option value="🏫">🏫 College</option>
                <option value="💼">💼 Work</option>
                <option value="📍">📍 Custom</option>
              </select>
              <input
                type="text"
                placeholder="Place Label (e.g. Work Lab)"
                value={newPlaceName}
                onChange={(e) => setNewPlaceName(e.target.value)}
              />
              <select value={newPlaceArea} onChange={(e) => setNewPlaceArea(e.target.value)}>
                {presetLocations.map((loc) => (
                  <option key={loc.name} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
              <Button $primary onClick={addPlace}>
                <MdAdd /> Save Place
              </Button>
            </AddPlaceForm>
          </div>
        </FormGrid>
      </SectionCard>

      {/* SECTION 2: ALERTS & TRIGGERS */}
      <SectionCard id="sec-alerts" $highContrast={highContrast} $largeText={largeText}>
        <SectionHeader>
          <h3>
            <MdNotifications /> {t.sec2}
          </h3>
          <Button $primary onClick={testVoiceAlert}>
            <MdVolumeUp /> Test Live Voice Speech
          </Button>
        </SectionHeader>

        <FormGrid>
          <label style={{ fontSize: '0.9rem', fontWeight: 700, color: colors.textPrimary }}>
            ☑ Subscribed Environmental Hazards Checklist
          </label>
          <CheckboxGrid>
            <CheckboxCard>
              <input type="checkbox" checked={hazards.fire} onChange={() => toggleHazard('fire')} /> 🔥 Forest Fire
            </CheckboxCard>
            <CheckboxCard>
              <input type="checkbox" checked={hazards.flood} onChange={() => toggleHazard('flood')} /> 🌊 Flood & Rain
            </CheckboxCard>
            <CheckboxCard>
              <input type="checkbox" checked={hazards.heat} onChange={() => toggleHazard('heat')} /> 🌡️ Extreme Heat
            </CheckboxCard>
            <CheckboxCard>
              <input type="checkbox" checked={hazards.air} onChange={() => toggleHazard('air')} /> 🌫️ Air Pollution
            </CheckboxCard>
            <CheckboxCard>
              <input type="checkbox" checked={hazards.landslide} onChange={() => toggleHazard('landslide')} /> ⛰️ Landslide Seismic
            </CheckboxCard>
            <CheckboxCard>
              <input type="checkbox" checked={hazards.water} onChange={() => toggleHazard('water')} /> 💧 Water Quality
            </CheckboxCard>
            <CheckboxCard>
              <input type="checkbox" checked={hazards.industrial} onChange={() => toggleHazard('industrial')} /> 🏭 Industrial Hazard
            </CheckboxCard>
          </CheckboxGrid>

          <FormRow $largeText={largeText} style={{ marginTop: '0.5rem' }}>
            <label>
              Alert Severity Threshold
              <span>Only display alerts matching minimum severity</span>
            </label>
            <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
              <option value="CRITICAL">🔴 Critical Hazards Only</option>
              <option value="HIGH">🟠 High + Critical</option>
              <option value="ALL">🟡 All Warnings & Alerts</option>
            </select>
          </FormRow>

          <FormRow $largeText={largeText}>
            <label>
              Browser Push Notifications
              <span>Enable live alert popups for active hazards</span>
            </label>
            <ToggleSwitch $on={notifs} onClick={() => setNotifs(!notifs)} />
          </FormRow>

          <FormRow $largeText={largeText}>
            <label>
              Audio Siren Sound
              <span>Play audible alarm during high severity risks</span>
            </label>
            <ToggleSwitch $on={sound} onClick={() => setSound(!sound)} />
          </FormRow>

          <FormRow $largeText={largeText}>
            <label>
              Mobile Haptic Vibration
              <span>Vibrate device on receiving emergency trigger</span>
            </label>
            <ToggleSwitch $on={vibration} onClick={() => setVibration(!vibration)} />
          </FormRow>

          <FormRow $largeText={largeText}>
            <label>
              Voice Speech Announcement
              <span>Announce danger telemetry using speech synthesis</span>
            </label>
            <ToggleSwitch $on={voiceAlert} onClick={() => setVoiceAlert(!voiceAlert)} />
          </FormRow>
        </FormGrid>
      </SectionCard>

      {/* SECTION 3: SAFETY & HISTORY */}
      <SectionCard id="sec-safety" $highContrast={highContrast} $largeText={largeText}>
        <SectionHeader>
          <h3>
            <MdSecurity /> {t.sec3}
          </h3>
        </SectionHeader>

        <FormGrid>
          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: colors.textPrimary, display: 'block', marginBottom: '0.6rem' }}>
              📜 Real-Time Hazard Alert Feed ({selectedArea})
            </label>
            {Object.entries(liveNode.risks.hazards)
              .filter(([key, h]) => h.risk === 'WARNING' || h.risk === 'HIGH' || h.risk === 'CRITICAL')
              .length > 0 ? (
                Object.entries(liveNode.risks.hazards)
                  .filter(([key, h]) => h.risk === 'WARNING' || h.risk === 'HIGH' || h.risk === 'CRITICAL')
                  .map(([key, h]) => (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        background: colors.surfaceLight,
                        borderLeft: `4px solid ${h.risk === 'CRITICAL' || h.risk === 'HIGH' ? colors.danger : colors.warning}`,
                        marginBottom: '0.5rem',
                        fontSize: '0.85rem',
                      }}
                    >
                      <div style={{ fontWeight: 700, color: colors.textPrimary }}>
                        {h.icon} {h.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: colors.textMuted }}>
                        Station: {liveNode.name} • {nearestDist} km away
                      </div>
                      <div
                        style={{
                          fontWeight: 700,
                          color: h.risk === 'CRITICAL' || h.risk === 'HIGH' ? colors.danger : colors.warning,
                        }}
                      >
                        {h.risk}
                      </div>
                    </div>
                  ))
              ) : (
                <div style={{ padding: '0.85rem 1rem', borderRadius: '10px', background: colors.surfaceLight, border: `1px solid ${colors.glassBorder}`, fontSize: '0.85rem', color: colors.textSecondary }}>
                  🟢 <strong>No Active Warnings:</strong> All live environmental sensors in {selectedArea} report safe baseline readings.
                </div>
              )}
          </div>

          <div style={{ marginTop: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: colors.textPrimary, display: 'block', marginBottom: '0.6rem' }}>
              🚨 Quick Emergency Contacts Directory
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              <Button onClick={() => window.open('tel:100')}>
                <MdPhoneInTalk style={{ color: colors.danger }} /> Police: 100
              </Button>
              <Button onClick={() => window.open('tel:101')}>
                <MdPhoneInTalk style={{ color: colors.warning }} /> Fire & Rescue: 101
              </Button>
              <Button onClick={() => window.open('tel:108')}>
                <MdPhoneInTalk style={{ color: colors.success }} /> Ambulance: 108
              </Button>
              <Button onClick={() => window.open('tel:1077')}>
                <MdPhoneInTalk style={{ color: colors.primaryLight }} /> Disaster Helpline: 1077
              </Button>
            </div>
          </div>
        </FormGrid>
      </SectionCard>

      {/* SECTION 4: PERSONALIZATION & ACCESSIBILITY */}
      <SectionCard id="sec-personal" $highContrast={highContrast} $largeText={largeText}>
        <SectionHeader>
          <h3>
            <MdLanguage /> {t.sec4}
          </h3>
        </SectionHeader>

        <FormGrid>
          <FormRow $largeText={largeText}>
            <label>
              Display Language / மொழி / भाषा
              <span>Select UI language for instant localized titles</span>
            </label>
            <select value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="EN">English</option>
              <option value="TA">தமிழ் (Tamil)</option>
              <option value="HI">हिन्दी (Hindi)</option>
            </select>
          </FormRow>

          <FormRow $largeText={largeText}>
            <label>
              Large Text Display
              <span>Increase font sizes across all control cards</span>
            </label>
            <ToggleSwitch $on={largeText} onClick={() => setLargeText(!largeText)} />
          </FormRow>

          <FormRow $largeText={largeText}>
            <label>
              High Contrast Display Mode
              <span>Enable neon high-visibility borders for visual clarity</span>
            </label>
            <ToggleSwitch $on={highContrast} onClick={() => setHighContrast(!highContrast)} />
          </FormRow>
        </FormGrid>
      </SectionCard>

      {/* SECTION 5: LIVE HARDWARE TELEMETRY */}
      <SectionCard id="sec-hardware" $highContrast={highContrast} $largeText={largeText}>
        <SectionHeader>
          <h3>
            <MdSensors /> {t.sec5}
          </h3>
          <div style={{ fontSize: '0.8rem', color: colors.textMuted }}>
            Station: <strong>{liveNode.name}</strong> • Status: <strong>{liveNode.status}</strong>
          </div>
        </SectionHeader>

        <HardwareGaugesGrid>
          <HardwareCard>
            <div className="metric-name">🌡️ Ambient Temperature</div>
            <div className="metric-val">{liveNode.sensorData.temperature ?? liveNode.sensors.temperature ?? '--'} °C</div>
            <div className="metric-status" $danger={(liveNode.sensorData.temperature ?? 0) > 40}>
              {(liveNode.sensorData.temperature ?? 0) > 40 ? 'HIGH HEAT' : 'NORMAL RANGE'}
            </div>
          </HardwareCard>

          <HardwareCard>
            <div className="metric-name">🌫️ MQ2 Gas / Smoke</div>
            <div className="metric-val">{liveNode.sensorData.mq2 ?? liveNode.sensors.mq2_raw ?? 'Normal'} RAW</div>
            <div className="metric-status" $danger={(liveNode.sensorData.mq2 ?? 0) >= 3051}>
              {(liveNode.sensorData.mq2 ?? 0) >= 3150 ? 'HIGH RISK' : (liveNode.sensorData.mq2 ?? 0) >= 3051 ? 'WARNING' : 'CLEAN AIR (SAFE)'}
            </div>
          </HardwareCard>

          <HardwareCard>
            <div className="metric-name">⛰️ Soil Vibration</div>
            <div className="metric-val">{liveNode.sensorData.vibration ?? liveNode.sensors.vibration_raw ?? '0'} G</div>
            <div className="metric-status" $danger={(liveNode.sensorData.vibration ?? 0) > 70}>
              {(liveNode.sensorData.vibration ?? 0) > 70 ? 'SEISMIC WARNING' : 'STABLE GROUND'}
            </div>
          </HardwareCard>

          <HardwareCard>
            <div className="metric-name">💧 Humidity / Moisture</div>
            <div className="metric-val">{liveNode.sensorData.humidity ?? liveNode.sensors.humidity ?? '--'} %</div>
            <div className="metric-status">NORMAL MOISTURE</div>
          </HardwareCard>

          <HardwareCard>
            <div className="metric-name">🌊 Water Level / Flood Risk</div>
            <div className="metric-val">{liveNode.sensorData.water_level ?? 50} % ({liveNode.sensorData.water_level_condition || 'NORMAL'})</div>
            <div className="metric-status" $danger={(liveNode.sensorData.water_level ?? 50) > 80 || liveNode.sensorData.water_level_condition === 'HIGH'}>
              {(liveNode.sensorData.water_level ?? 50) > 80 || liveNode.sensorData.water_level_condition === 'HIGH' ? 'HIGH WATER (WARNING)' : 'NORMAL LEVEL (SAFE)'}
            </div>
          </HardwareCard>

          <HardwareCard>
            <div className="metric-name">🧪 Water Quality pH</div>
            <div className="metric-val">{liveNode.sensorData.ph ?? liveNode.sensors.ph_raw ?? 7.2} pH</div>
            <div className="metric-status">BALANCED WATER</div>
          </HardwareCard>

          <HardwareCard>
            <div className="metric-name">🌊 Water Turbidity</div>
            <div className="metric-val">{liveNode.sensorData.turbidity ?? 3400} RAW</div>
            <div className="metric-status" $danger={(liveNode.sensorData.turbidity ?? 3400) < 1500}>
              {(liveNode.sensorData.turbidity ?? 3400) >= 3000 ? 'CLEAR WATER (SAFE)' : (liveNode.sensorData.turbidity ?? 3400) >= 1500 ? 'MODERATE TURBIDITY (WARNING)' : 'HIGH TURBIDITY (UNSAFE)'}
            </div>
          </HardwareCard>
        </HardwareGaugesGrid>
      </SectionCard>

      {/* Floating Toast Notification */}
      {toastMsg && (
        <Toast>
          <MdCheck size={18} /> {toastMsg}
        </Toast>
      )}
    </Container>
  );
};
export default PublicProfile;


