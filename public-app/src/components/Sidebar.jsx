// src/components/Sidebar.jsx
import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { colors } from '../theme/colors';
import {
  MdDashboard,
  MdWarning,
  MdEco,
  MdSensors,
  MdInsights,
  MdNotifications,
  MdDeviceHub,
  MdMap,
  MdList,
  MdBarChart,
  MdAssignment,
  MdSummarize,
  MdSettings,
} from 'react-icons/md';

const SidebarContainer = styled.nav`
  width: 240px;
  min-width: 240px;
  background: ${colors.sidebarBg};
  border-right: 1px solid ${colors.glassBorder};
  padding: 1.5rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow-y: auto;
  height: calc(100vh - 56px);

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
    height: auto;
    flex-direction: row;
    justify-content: flex-start;
    padding: 0.5rem;
    border-right: none;
    border-bottom: 1px solid ${colors.glassBorder};
    overflow-x: auto;
  }
`;

const StyledLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  color: ${colors.textSecondary};
  text-decoration: none;
  font-weight: 500;
  font-size: 0.88rem;
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;

  svg {
    font-size: 1.15rem;
    flex-shrink: 0;
    transition: color 0.2s ease;
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

  @media (max-width: 768px) {
    padding: 0.45rem 0.75rem;
    font-size: 0.78rem;

    &.active::before {
      display: none;
    }
  }
`;

const SectionTitle = styled.div`
  margin: 0.6rem 0 0.3rem;
  font-size: 0.68rem;
  font-weight: 700;
  color: ${colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding-left: 0.85rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Sidebar = () => (
  <SidebarContainer>
    <SectionTitle>Command Center</SectionTitle>
    <StyledLink to="/dashboard/home">
      <MdDashboard /> Overview
    </StyledLink>
    <StyledLink to="/dashboard/map">
      <MdMap /> Risk Map
    </StyledLink>
    <StyledLink to="/dashboard/alerts">
      <MdNotifications /> Alerts Lifecycle
    </StyledLink>
    <StyledLink to="/dashboard/incidents">
      <MdAssignment /> Incidents
    </StyledLink>

    <SectionTitle>Telemetry & AI</SectionTitle>
    <StyledLink to="/dashboard/sensors">
      <MdSensors /> Live Sensors
    </StyledLink>
    <StyledLink to="/dashboard/ai">
      <MdInsights /> AI / ML Engine
    </StyledLink>
    <StyledLink to="/dashboard/disaster">
      <MdWarning /> Disaster Monitor
    </StyledLink>
    <StyledLink to="/dashboard/environment">
      <MdEco /> Environment
    </StyledLink>

    <SectionTitle>Management</SectionTitle>
    <StyledLink to="/dashboard/nodes">
      <MdList /> Node Management
    </StyledLink>
    <StyledLink to="/dashboard/device">
      <MdDeviceHub /> Device Health
    </StyledLink>
    <StyledLink to="/dashboard/analytics">
      <MdBarChart /> Analytics
    </StyledLink>
    <StyledLink to="/dashboard/reports">
      <MdSummarize /> Reports
    </StyledLink>
    <StyledLink to="/dashboard/settings">
      <MdSettings /> System Settings
    </StyledLink>
  </SidebarContainer>
);

export default Sidebar;
