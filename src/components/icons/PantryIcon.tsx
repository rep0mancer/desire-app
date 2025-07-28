// FILE: src/components/icons/PantryIcon.tsx
import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors } from '../../constants/colors';

interface PantryIconProps {
  color?: string;
  size?: number;
}

const PantryIcon: React.FC<PantryIconProps> = ({ color = colors.primaryText, size = 28 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 8H16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 12H16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 16H12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export default PantryIcon;
