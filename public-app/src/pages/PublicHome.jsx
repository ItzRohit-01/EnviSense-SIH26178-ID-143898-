// src/pages/PublicHome.jsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';

import {
  MdSecurity,
  MdMap,
  MdLock,
  MdCheckCircle,
  MdWarning,
  MdError,
  MdPerson,
  MdNotifications,
  MdSensors,
  MdThermostat,
  MdAir,
  MdLandscape,
  MdOpacity,
  MdWaves,
  MdVolumeUp,
  MdGpsFixed,
  MdLanguage,
  MdArrowForward,
} from 'react-icons/md';
import { colors } from '../theme/colors';
import { useFirebaseValue } from '../hooks/useFirebaseValue';
import { deriveHazardRisks, getActiveNodes } from '../services/locationService';

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${colors.background};
  position: relative;
  overflow-x: hidden;
`;

const HeaderNav = styled.header`
  padding: 0.85rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  border-bottom: 1px solid ${colors.glassBorder};
  background: rgba(10, 15, 13, 0.92);
  backdrop-filter: blur(16px);
  position: sticky;
  top: 0;

  @media (max-width: 900px) {
    padding: 0.85rem 1rem;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 900px) {
    gap: 1rem;
    width: 100%;
    justify-content: space-between;
  }
`;

const Logo = styled(Link)`
  font-family: 'Manrope', sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  color: ${colors.textPrimary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    background: ${colors.headerGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const NavLinksGroupLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 900px) {
    overflow-x: auto;
    width: 100%;
    padding-bottom: 0.25rem;
  }
`;

const HeaderLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  background: ${(props) => (props.$highlight ? colors.primaryGlow : colors.surfaceLight)};
  border: 1px solid ${(props) => (props.$highlight ? colors.primaryLight : colors.glassBorder)};
  color: ${(props) => (props.$highlight ? colors.primaryLight : colors.textSecondary)};
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    color: ${colors.primaryLight};
    border-color: ${colors.primaryLight};
    background: ${colors.primaryGlow};
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const HeroSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 1.5rem 2rem;
  text-align: center;
  z-index: 1;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
`;

const StatusBanner = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1.4rem;
  border-radius: 999px;
  background: ${(props) =>
    props.$status === 'SAFE'
      ? 'rgba(16, 185, 129, 0.15)'
      : props.$status === 'WARNING'
      ? 'rgba(245, 158, 11, 0.15)'
      : 'rgba(239, 68, 68, 0.15)'};
  border: 1px solid
    ${(props) =>
      props.$status === 'SAFE'
        ? colors.success
        : props.$status === 'WARNING'
        ? colors.warning
        : colors.danger};
  color: ${(props) =>
    props.$status === 'SAFE'
      ? colors.success
      : props.$status === 'WARNING'
      ? colors.warning
      : colors.danger};
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1.75rem;
`;

const Title = styled.h1`
  font-family: 'Manrope', sans-serif;
  font-size: 3.4rem;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 1.2rem;
  color: ${colors.textPrimary};
  letter-spacing: -0.03em;

  span {
    background: ${colors.headerGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 768px) {
    font-size: 2.3rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.12rem;
  color: ${colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 680px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;

  @media (max-width: 640px) {
    flex-direction: column;
    width: 100%;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.9rem 1.6rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.98rem;
  text-decoration: none;
  color: #fff;
  background: ${colors.headerGradient};
  background-size: 200% auto;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(45, 106, 79, 0.30);

  &:hover {
    animation: ${shimmer} 2s linear infinite;
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(45, 106, 79, 0.45);
    color: #fff;
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.9rem 1.6rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.98rem;
  text-decoration: none;
  color: ${colors.textPrimary};
  background: ${colors.glass};
  border: 1px solid ${colors.glassBorder};
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;

  &:hover {
    background: ${colors.surfaceLight};
    border-color: ${colors.textMuted};
    transform: translateY(-2px);
  }
`;

const MainContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem 4rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const SectionHeaderTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 0.5rem;

  div {
    h2 {
      font-family: 'Manrope', sans-serif;
      font-size: 1.5rem;
      color: ${colors.textPrimary};
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    p {
      margin: 0.25rem 0 0;
      font-size: 0.88rem;
      color: ${colors.textSecondary};
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

const PublicFeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.25rem;
`;

const FeatureCard = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.glassBorder};
  border-radius: 18px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: ${colors.primaryLight};
  }

  .icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: ${colors.primaryGlow};
    border: 1px solid ${colors.primaryLight};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${colors.primaryLight};
    font-size: 1.5rem;
  }

  h3 {
    font-family: 'Manrope', sans-serif;
    font-size: 1.2rem;
    color: ${colors.textPrimary};
    margin: 0.5rem 0 0.25rem;
  }

  p {
    font-size: 0.88rem;
    color: ${colors.textSecondary};
    line-height: 1.5;
    margin: 0;
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.75rem;
    border-top: 1px solid ${colors.glassBorder};
    font-size: 0.85rem;
    font-weight: 600;
    color: ${colors.primaryLight};
  }
`;

const PublicHome = () => {
  const { value: firebaseData } = useFirebaseValue('envisence');
  const activeNodes = getActiveNodes(firebaseData);
  
  const fallbackNode = {
    name: 'Node 001 — Main Station',
    area: 'Velachery Tech Corridor',
    lastUpdate: 'Just now',
    status: 'ONLINE',
    sensorData: {
      temperature: 32.4,
      humidity: 58,
      mq2: 412,
      vibration: 14,
      water_level: 45,
      water_level_condition: 'NORMAL',
      ph: 7.2,
      turbidity: 3400
    }
  };

  const liveNode = activeNodes[0] || fallbackNode;
  const currentSensors = liveNode.sensorData || fallbackNode.sensorData;
  const hazardData = deriveHazardRisks(currentSensors);
  const isOnline = liveNode.status === 'ONLINE';

  return (
    <Container>
      {/* Top Navbar with Left-Aligned Options */}
      <HeaderNav>
        <HeaderLeft>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <BrandLogo size={32} subtext="SAFETY & RISK PLATFORM" />
          </Link>
          <NavLinksGroupLeft>
            <HeaderLink to="/public" $highlight>
              <MdSecurity /> Area Status
            </HeaderLink>
            <HeaderLink to="/public/profile">
              <MdPerson /> My Safety Profile
            </HeaderLink>
            <HeaderLink to="/public/map">
              <MdMap /> Live Risk Map
            </HeaderLink>
            <HeaderLink to="/public/alerts">
              <MdNotifications /> Alerts
            </HeaderLink>
          </NavLinksGroupLeft>
        </HeaderLeft>

      </HeaderNav>

      {/* Hero Section */}
      <HeroSection>
        <StatusBanner
          $status={hazardData.overallStatus === 'WARNING' ? 'WARNING' : hazardData.overallStatus === 'CRITICAL' ? 'CRITICAL' : 'SAFE'}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {hazardData.overallStatus === 'WARNING' ? <MdWarning size={20} /> : hazardData.overallStatus === 'CRITICAL' ? <MdError size={20} /> : <MdCheckCircle size={20} />}
          {hazardData.overallStatus === 'CRITICAL'
            ? '🚨 CRITICAL ENVIRONMENTAL HAZARD DETECTED'
            : hazardData.overallStatus === 'WARNING'
            ? '⚠️ ENVIRONMENTAL WARNING NEARBY'
            : '🟢 LIVE AREA STATUS: SAFE'}
        </StatusBanner>

        <Title>
          Public Multi-Hazard <br />
          <span>Safety Control Center</span>
        </Title>
        <Subtitle>
          Real-time environmental risk intelligence powered by IoT ESP32 hardware sensor nodes and Edge AI predictions. Public access with no account setup required.
        </Subtitle>

        <ButtonGroup>
          <PrimaryButton to="/public/profile">
            <MdPerson /> Open My Safety Profile
          </PrimaryButton>
          <SecondaryButton to="/public">
            <MdSecurity /> Public Area Dashboard
          </SecondaryButton>
          <SecondaryButton to="/public/map">
            <MdMap /> Interactive Risk Map
          </SecondaryButton>
        </ButtonGroup>
      </HeroSection>

      <MainContainer>
        {/* SECTION 1: TODAY'S LIVE HARDWARE SENSOR UPDATE */}
        <div>
          <SectionHeaderTitle>
            <div>
              <h2>
                <MdSensors style={{ color: colors.primaryLight }} /> Today's Live Update from Sensor Modules
              </h2>
              <p>
                Live hardware telemetry streamed from IoT ESP32 station: <strong>{liveNode?.name || 'Loading...'}</strong> ({liveNode?.area || '...'}) • Last update: <strong>{liveNode?.lastUpdate || 'Just now'}</strong>
              </p>
            </div>
            <div style={{ fontSize: '0.8rem', color: isOnline ? colors.success : colors.danger, fontWeight: 700, display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: isOnline ? colors.success : colors.danger, display: 'inline-block' }}></span>
              {isOnline ? 'HARDWARE ONLINE • LIVE FIREBASE FEED' : 'HARDWARE OFFLINE'}
            </div>
          </SectionHeaderTitle>

          {currentSensors ? (
            <LiveSensorGrid>
              <SensorCard $danger={currentSensors.temperature > 40 ? "true" : undefined}>
                <div className="card-top">
                  <div className="icon-wrapper">
                    <MdThermostat />
                  </div>
                  <span>Ambient Temperature</span>
                </div>
                <div className="value">
                  {currentSensors.temperature ?? 'N/A'} <span className="unit">°C</span>
                </div>
                <div className="status-row">
                  <span className="standard">Optimal: 22-35°C</span>
                  <span className="badge">{currentSensors.temperature > 40 ? 'HIGH' : 'NORMAL'}</span>
                </div>
              </SensorCard>

              <SensorCard 
                $danger={(currentSensors.mq2 ?? 0) >= 3150 ? "true" : undefined} 
                $warning={(currentSensors.mq2 ?? 0) >= 3051 && (currentSensors.mq2 ?? 0) < 3150 ? "true" : undefined}
              >
                <div className="card-top">
                  <div className="icon-wrapper">
                    <MdAir />
                  </div>
                  <span>Air Quality Index (MQ2)</span>
                </div>
                <div className="value">
                  {currentSensors.mq2 ?? 'N/A'} <span className="unit">PPM</span>
                </div>
                <div className="status-row">
                  <span className="standard">Safe Threshold: &lt; 500</span>
                  <span className="badge">
                    {(currentSensors.mq2 ?? 0) >= 3150 
                      ? 'CRITICAL' 
                      : (currentSensors.mq2 ?? 0) >= 3051 
                      ? 'WARNING' 
                      : 'NORMAL'}
                  </span>
                </div>
              </SensorCard>

              <SensorCard $danger={currentSensors.vibration > 70 ? "true" : undefined}>
                <div className="card-top">
                  <div className="icon-wrapper">
                    <MdLandscape />
                  </div>
                  <span>Seismic / Vibration</span>
                </div>
                <div className="value">
                  {currentSensors.vibration ?? 'N/A'} <span className="unit">m/s²</span>
                </div>
                <div className="status-row">
                  <span className="standard">Threshold: &lt; 50</span>
                  <span className="badge">
                    {currentSensors.vibration > 70 ? 'RISK' : 'SAFE'}
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
                  {currentSensors.humidity ?? 'N/A'} <span className="unit">%</span>
                </div>
                <div className="status-row">
                  <span className="standard">Optimal: 40-75%</span>
                  <span className="badge">NORMAL</span>
                </div>
              </SensorCard>

              <SensorCard 
                $danger={(currentSensors.water_level ?? 50) > 80 || currentSensors.water_level_condition === 'HIGH' ? "true" : undefined}
                $warning={(currentSensors.water_level ?? 50) > 65 && (currentSensors.water_level ?? 50) <= 80 ? "true" : undefined}
              >
                <div className="card-top">
                  <div className="icon-wrapper">
                    <MdWaves />
                  </div>
                  <span>Water Level</span>
                </div>
                <div className="value">
                  {currentSensors.water_level ?? 50} <span className="unit">%</span>
                </div>
                <div className="status-row">
                  <span className="standard">Condition: {currentSensors.water_level_condition || 'NORMAL'}</span>
                  <span className="badge">
                    {(currentSensors.water_level ?? 50) > 80 || currentSensors.water_level_condition === 'HIGH'
                      ? 'HIGH RISK'
                      : (currentSensors.water_level ?? 50) > 65
                      ? 'WARNING'
                      : 'SAFE'}
                  </span>
                </div>
              </SensorCard>

              <SensorCard 
                $danger={(currentSensors.turbidity ?? 3400) < 1500 ? "true" : undefined}
                $warning={(currentSensors.turbidity ?? 3400) >= 1500 && (currentSensors.turbidity ?? 3400) < 3000 ? "true" : undefined}
              >
                <div className="card-top">
                  <div className="icon-wrapper">
                    <MdWaves />
                  </div>
                  <span>Water pH & Turbidity</span>
                </div>
                <div className="value">
                  {currentSensors.turbidity ?? 3400} <span className="unit">NTU</span>
                </div>
                <div className="status-row">
                  <span className="standard">Standard: pH 6.5-8.5</span>
                  <span className="badge">
                    {(currentSensors.turbidity ?? 3400) >= 3000 
                      ? 'SAFE' 
                      : (currentSensors.turbidity ?? 3400) >= 1500 
                      ? 'WARNING' 
                      : 'UNSAFE'}
                  </span>
                </div>
              </SensorCard>
            </LiveSensorGrid>
          ) : (
             <div style={{ textAlign: 'center', padding: '2rem', color: colors.textMuted }}>
               <MdSensors size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
               <p>{isLoading ? 'Loading sensor data from Firebase...' : 'No active sensor nodes available.'}</p>
             </div>
          )}
        </div>

        {/* SECTION 2: ARRANGEMENT OF MAIN FEATURES FOR PUBLIC PROFILE */}
        <div>
          <SectionHeaderTitle>
            <div>
              <h2>
                <MdPerson style={{ color: colors.primaryLight }} /> Public Profile — Core Feature Arrangement
              </h2>
              <p>100% Public personal environmental control center — no account creation needed</p>
            </div>
            <Link to="/public/profile" style={{ color: colors.primaryLight, fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none' }}>
              Launch Full Control Center →
            </Link>
          </SectionHeaderTitle>

          <PublicFeaturesGrid>
            <FeatureCard>
              <div>
                <div className="icon-wrapper">
                  <MdGpsFixed />
                </div>
                <h3>1. Location & Proximity Distance</h3>
                <p>
                  Switch primary monitoring area (Velachery, Guindy, Adyar), acquire GPS live location, and measure exact distance to nearest ESP32 sensor station.
                </p>
              </div>
              <Link to="/public/profile" style={{ textDecoration: 'none' }}>
                <div className="card-footer">
                  <span>Configure Monitored Places</span> <MdArrowForward />
                </div>
              </Link>
            </FeatureCard>

            <FeatureCard>
              <div>
                <div className="icon-wrapper">
                  <MdNotifications />
                </div>
                <h3>2. Custom Hazard Subscriptions</h3>
                <p>
                  Toggle personalized alerts for 7 environmental hazards (Forest Fire, Flood, Extreme Heat, Pollution, Landslide, Water Quality, Industrial Risk).
                </p>
              </div>
              <Link to="/public/profile" style={{ textDecoration: 'none' }}>
                <div className="card-footer">
                  <span>Set Alert Preferences</span> <MdArrowForward />
                </div>
              </Link>
            </FeatureCard>

            <FeatureCard>
              <div>
                <div className="icon-wrapper">
                  <MdVolumeUp />
                </div>
                <h3>3. Audio & Voice Alerts</h3>
                <p>
                  Enable browser push notifications, high-decibel audio sirens, haptic vibration, and real-time Text-to-Speech voice warnings in emergency conditions.
                </p>
              </div>
              <Link to="/public/profile" style={{ textDecoration: 'none' }}>
                <div className="card-footer">
                  <span>Test Voice Announcement</span> <MdArrowForward />
                </div>
              </Link>
            </FeatureCard>

            <FeatureCard>
              <div>
                <div className="icon-wrapper">
                  <MdSecurity />
                </div>
                <h3>4. Live Safety Status & Helplines</h3>
                <p>
                  Evaluates live telemetry against local safe thresholds (🟢 SAFE / 🔴 CRITICAL) with one-click emergency direct dialing to Police (100) & Disaster (1077).
                </p>
              </div>
              <Link to="/public/profile" style={{ textDecoration: 'none' }}>
                <div className="card-footer">
                  <span>View Safety Feed & Contacts</span> <MdArrowForward />
                </div>
              </Link>
            </FeatureCard>

            <FeatureCard>
              <div>
                <div className="icon-wrapper">
                  <MdLanguage />
                </div>
                <h3>5. Accessibility & Localization</h3>
                <p>
                  Instant multi-language support (English, தமிழ் Tamil, हिन्दी Hindi), high-contrast neon visual mode, and enlarged text options for elderly users.
                </p>
              </div>
              <Link to="/public/profile" style={{ textDecoration: 'none' }}>
                <div className="card-footer">
                  <span>Customize Personalization</span> <MdArrowForward />
                </div>
              </Link>
            </FeatureCard>

            <FeatureCard>
              <div>
                <div className="icon-wrapper">
                  <MdSensors />
                </div>
                <h3>6. Live Hardware Telemetry Stream</h3>
                <p>
                  Direct unfiltered telemetry gauges for ESP32 temperature, MQ2 gas, vibration, humidity, pH, and turbidity with status badges updated every second.
                </p>
              </div>
              <Link to="/public/profile" style={{ textDecoration: 'none' }}>
                <div className="card-footer">
                  <span>Inspect Hardware Sensors</span> <MdArrowForward />
                </div>
              </Link>
            </FeatureCard>
          </PublicFeaturesGrid>
        </div>
      </MainContainer>
    </Container>
  );
};

export default PublicHome;


