// src/components/PublicSidebar.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import { colors } from '../theme/colors';
import {
  MdHome,
  MdLocationOn,
  MdMap,
  MdWarning,
  MdNotifications,
  MdEco,
  MdSecurity,
  MdPhoneInTalk,
  MdPerson,
  MdExpandMore,
  MdChevronRight,
} from 'react-icons/md';

const SidebarContainer = styled.nav`
  width: 240px;
  min-width: 240px;
  background: ${colors.sidebarBg};
  border-right: 1px solid ${colors.glassBorder};
  padding: 1.25rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  overflow-y: auto;
  height: calc(100vh - 56px);

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
    height: auto;
    flex-direction: row;
    padding: 0.5rem;
    border-right: none;
    border-bottom: 1px solid ${colors.glassBorder};
    overflow-x: auto;
  }
`;

const MainCategoryGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    flex-shrink: 0;
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  color: ${(props) => (props.$active ? colors.sidebarActiveText : colors.textPrimary)};
  background: ${(props) => (props.$active ? colors.sidebarActiveBg : 'transparent')};
  font-weight: ${(props) => (props.$active ? '700' : '600')};
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;

  .left {
    display: flex;
    align-items: center;
    gap: 0.65rem;

    svg {
      font-size: 1.15rem;
      flex-shrink: 0;
      color: ${(props) => (props.$active ? colors.sidebarActiveText : colors.textSecondary)};
    }
  }

  .toggle-icon {
    font-size: 1.1rem;
    color: ${colors.textMuted};
  }

  &:hover {
    background: ${colors.sidebarActiveBg};
    color: ${colors.sidebarActiveText};
  }
`;

const PrimaryLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  color: ${colors.textPrimary};
  text-decoration: none;
  font-weight: 600;
  font-size: 0.88rem;
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;

  svg {
    font-size: 1.15rem;
    flex-shrink: 0;
    color: ${colors.textSecondary};
  }

  &.active {
    background: ${colors.sidebarActiveBg};
    color: ${colors.sidebarActiveText};
    font-weight: 700;

    svg {
      color: ${colors.sidebarActiveText};
    }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      border-radius: 0 3px 3px 0;
      background: ${colors.sidebarActiveBar};
    }
  }

  &:hover:not(.active) {
    background: ${colors.sidebarActiveBg};
    color: ${colors.sidebarActiveText};
  }
`;

const SubMenu = styled.div`
  display: ${(props) => (props.$open ? 'flex' : 'none')};
  flex-direction: column;
  gap: 0.15rem;
  padding-left: 1.5rem;
  margin-top: 0.15rem;

  @media (max-width: 768px) {
    display: ${(props) => (props.$open ? 'flex' : 'none')};
    flex-direction: row;
    padding-left: 0.25rem;
    flex-shrink: 0;
  }
`;

const SubLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.75rem;
  border-radius: 8px;
  color: ${colors.textSecondary};
  text-decoration: none;
  font-weight: 500;
  font-size: 0.82rem;
  transition: all 0.2s ease;

  svg {
    font-size: 0.95rem;
    flex-shrink: 0;
  }

  &.active {
    color: ${colors.sidebarActiveText};
    background: ${colors.sidebarActiveBg};
    font-weight: 700;
  }

  &:hover:not(.active) {
    color: ${colors.textPrimary};
    background: ${colors.surfaceLight};
  }
`;

const PublicSidebar = () => {
  const location = useLocation();

  const [openHome, setOpenHome] = useState(true);
  const [openAlerts, setOpenAlerts] = useState(
    location.pathname.includes('/alerts') || location.pathname.includes('/risks')
  );
  const [openSafety, setOpenSafety] = useState(
    location.pathname.includes('/safety') ||
    location.pathname.includes('/emergency') ||
    location.pathname.includes('/profile')
  );

  const isHomeActive = location.pathname === '/public' || location.pathname === '/public/' || location.pathname.includes('/status');
  const isAlertsActive = location.pathname.includes('/alerts') || location.pathname.includes('/risks');
  const isSafetyActive = location.pathname.includes('/safety') || location.pathname.includes('/emergency') || location.pathname.includes('/profile');

  return (
    <SidebarContainer>
      {/* 1. HOME */}
      <MainCategoryGroup>
        <CategoryHeader $active={isHomeActive} onClick={() => setOpenHome(!openHome)}>
          <div className="left">
            <MdHome />
            <span>HOME</span>
          </div>
          <span className="toggle-icon">
            {openHome ? <MdExpandMore /> : <MdChevronRight />}
          </span>
        </CategoryHeader>
        <SubMenu $open={openHome}>
          <SubLink to="/public" end>
            <MdLocationOn /> Area Status
          </SubLink>
          <SubLink to="/public/status">
            <MdEco /> Environment Metrics
          </SubLink>
        </SubMenu>
      </MainCategoryGroup>

      {/* 2. MAP */}
      <PrimaryLink to="/public/map">
        <MdMap />
        <span>MAP</span>
      </PrimaryLink>

      {/* 3. ALERTS */}
      <MainCategoryGroup>
        <CategoryHeader $active={isAlertsActive} onClick={() => setOpenAlerts(!openAlerts)}>
          <div className="left">
            <MdNotifications />
            <span>ALERTS</span>
          </div>
          <span className="toggle-icon">
            {openAlerts ? <MdExpandMore /> : <MdChevronRight />}
          </span>
        </CategoryHeader>
        <SubMenu $open={openAlerts}>
          <SubLink to="/public/alerts">
            <MdNotifications /> Alert Center
          </SubLink>
          <SubLink to="/public/risks">
            <MdWarning /> Nearby Risks
          </SubLink>
        </SubMenu>
      </MainCategoryGroup>

      {/* 4. SAFETY */}
      <MainCategoryGroup>
        <CategoryHeader $active={isSafetyActive} onClick={() => setOpenSafety(!openSafety)}>
          <div className="left">
            <MdSecurity />
            <span>SAFETY</span>
          </div>
          <span className="toggle-icon">
            {openSafety ? <MdExpandMore /> : <MdChevronRight />}
          </span>
        </CategoryHeader>
        <SubMenu $open={openSafety}>
          <SubLink to="/public/safety">
            <MdSecurity /> Safety Guides
          </SubLink>
          <SubLink to="/public/emergency">
            <MdPhoneInTalk /> Emergency Contacts
          </SubLink>
          <SubLink to="/public/profile">
            <MdPerson /> My Safety Profile
          </SubLink>
        </SubMenu>
      </MainCategoryGroup>
    </SidebarContainer>
  );
};

export default PublicSidebar;
