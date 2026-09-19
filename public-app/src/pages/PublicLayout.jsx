// src/pages/PublicLayout.jsx
import React from 'react';
import styled from 'styled-components';
import { Routes, Route, Link } from 'react-router-dom';
import { MdLock, MdPerson, MdSecurity, MdNotifications, MdMap } from 'react-icons/md';
import { colors } from '../theme/colors';
import PublicSidebar from '../components/PublicSidebar';
import BrandLogo from '../components/BrandLogo';

import PublicDashboard from './PublicDashboard';
import NearbyRisks from './NearbyRisks';
import PublicMap from './PublicMap';
import PublicAlerts from './PublicAlerts';
import EnvironmentalStatus from './EnvironmentalStatus';
import SafetyCenter from './SafetyCenter';
import EmergencyCenter from './EmergencyCenter';
import PublicProfile from './PublicProfile';


const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: ${colors.background};
`;

const PublicHeader = styled.header`
  height: 56px;
  padding: 0 1.5rem;
  background: ${colors.surface};
  border-bottom: 1px solid ${colors.glassBorder};
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const Logo = styled(Link)`
  font-family: 'Manrope', sans-serif;
  font-weight: 800;
  font-size: 1.35rem;
  text-decoration: none;
  background: ${colors.headerGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HeaderNavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 900px) {
    display: none;
  }
`;

const HeaderNavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: ${colors.surfaceLight};
  border: 1px solid ${colors.glassBorder};
  color: ${colors.textSecondary};
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    color: ${colors.primaryLight};
    border-color: ${colors.primaryLight};
    background: ${colors.primaryGlow};
  }
`;

const AuthorityBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: ${colors.textSecondary};
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.4rem 0.85rem;
  border-radius: 8px;
  background: ${colors.surfaceLight};
  border: 1px solid ${colors.glassBorder};
  transition: all 0.2s ease;

  &:hover {
    color: ${colors.primaryLight};
    border-color: ${colors.primaryLight};
    background: ${colors.primaryGlow};
  }
`;

const ContentRow = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 1.5rem 2rem;
  overflow-y: auto;
  background: ${colors.background};

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PublicLayout = () => {
  return (
    <LayoutWrapper>
      <PublicHeader>
        <HeaderLeft>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <BrandLogo size={30} subtext="PUBLIC MONITORING" />
          </Link>
          <HeaderNavGroup>
            <HeaderNavLink to="/public/profile">
              <MdPerson /> My Safety Profile
            </HeaderNavLink>
            <HeaderNavLink to="/public">
              <MdSecurity /> Area Status
            </HeaderNavLink>
            <HeaderNavLink to="/public/map">
              <MdMap /> Risk Map
            </HeaderNavLink>
            <HeaderNavLink to="/public/alerts">
              <MdNotifications /> Alerts
            </HeaderNavLink>
          </HeaderNavGroup>
        </HeaderLeft>

      </PublicHeader>

      <ContentRow>
        <PublicSidebar />
        <MainContent>
          <Routes>
            <Route index element={<PublicDashboard />} />
            <Route path="map" element={<PublicMap />} />
            <Route path="risks" element={<NearbyRisks />} />
            <Route path="alerts" element={<PublicAlerts />} />
            <Route path="status" element={<EnvironmentalStatus />} />
            <Route path="safety" element={<SafetyCenter />} />
            <Route path="emergency" element={<EmergencyCenter />} />
            <Route path="profile" element={<PublicProfile />} />
          </Routes>
        </MainContent>
      </ContentRow>
    </LayoutWrapper>
  );
};

export default PublicLayout;

