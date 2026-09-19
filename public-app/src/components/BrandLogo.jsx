// src/components/BrandLogo.jsx
import React from 'react';
import styled from 'styled-components';
import { colors } from '../theme/colors';

const LogoContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  user-select: none;
`;

export const BrandIconImg = styled.img`
  height: ${({ size }) => size * 2}px; /* Increased relative size because the image has text and padding */
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 3px 10px rgba(0, 122, 255, 0.15));
  transition: transform 0.25s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1;
`;

const SubBadge = styled.span`
  font-size: 0.63rem;
  font-weight: 700;
  color: ${colors.textMuted || '#8e8e93'};
  letter-spacing: 0.12em;
  margin-top: 3px;
  text-transform: uppercase;
`;

const BrandLogo = ({ size = 32, showText = true, subtext, className }) => {
  return (
    <LogoContainer className={className}>
      <BrandIconImg src="/logo.png" size={size} alt="EnviSense Logo" />
      {showText && subtext && (
        <TextWrapper>
          <SubBadge>{subtext}</SubBadge>
        </TextWrapper>
      )}
    </LogoContainer>
  );
};

export default BrandLogo;
