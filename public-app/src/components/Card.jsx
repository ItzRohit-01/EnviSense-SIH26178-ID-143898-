import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { colors } from '../theme/colors';

const getStatusStyles = (status) => {
  if (!status) return null;
  const s = String(status).toUpperCase();
  
  if (s === 'CRITICAL' || s === 'HIGH' || s === 'RISK' || s === 'HIGH RISK' || s === 'HIGH_RISK' || s === 'DANGER' || s === 'ERROR' || s === 'FLAME DETECTED') {
    return css`
      border-color: rgba(239, 68, 68, 0.7) !important;
      box-shadow: 0 4px 24px rgba(239, 68, 68, 0.3) !important;
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(35, 15, 20, 0.9) 100%) !important;

      &::before {
        background: #ef4444 !important;
        opacity: 1 !important;
      }
    `;
  }
  
  if (s === 'WARNING' || s === 'WATCH' || s === 'MODERATE' || s === 'SMOKE DETECTED') {
    return css`
      border-color: rgba(245, 158, 11, 0.6) !important;
      box-shadow: 0 4px 20px rgba(245, 158, 11, 0.25) !important;
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(35, 28, 15, 0.9) 100%) !important;

      &::before {
        background: #f59e0b !important;
        opacity: 1 !important;
      }
    `;
  }

  // SAFE / OK / NORMAL / GOOD / STABLE -> GREEN
  return css`
    border-color: rgba(34, 197, 94, 0.5) !important;
    box-shadow: 0 4px 20px rgba(34, 197, 94, 0.18) !important;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(15, 30, 22, 0.9) 100%) !important;

    &::before {
      background: #22c55e !important;
      opacity: 1 !important;
    }
  `;
};

const Card = styled(motion.div)`
  background: ${colors.glass};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 1.5rem;
  border-radius: 16px;
  color: ${colors.textPrimary};
  border: 1px solid ${colors.glassBorder};
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${colors.headerGradient};
    opacity: 0.8;
    transition: opacity 0.3s ease;
  }

  ${({ $status, $variant, $risk }) => getStatusStyles($status || $variant || $risk)}

  &:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
    &::before {
      opacity: 1;
    }
  }

  h3 {
    font-family: 'Manrope', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: ${colors.textPrimary};
  }

  h4 {
    font-family: 'Manrope', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: ${colors.textSecondary};
    margin-bottom: 0.25rem;
  }

  p {
    font-size: 0.9rem;
    color: ${colors.textSecondary};
    margin: 0.3rem 0;
    line-height: 1.5;
  }
`;

export default Card;
