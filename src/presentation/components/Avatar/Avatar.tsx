import React, { useState } from 'react';
import { View, Image, ViewStyle } from 'react-native';
import { useTheme } from '@/shared/theme';
import { Text } from '../Text/Text';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 'md',
  style,
}) => {
  const { theme } = useTheme();
  const [hasError, setHasError] = useState(false);

  const getDimension = (): number => {
    switch (size) {
      case 'xs':
        return 24;
      case 'sm':
        return 32;
      case 'lg':
        return 56;
      case 'xl':
        return 72;
      case 'md':
      default:
        return 44;
    }
  };

  const getInitials = (text?: string): string => {
    if (!text) return '?';
    const parts = text.trim().split(/[\s/_.-]+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const dimension = getDimension();
  const radius = dimension / 2;

  const containerStyle: ViewStyle = {
    width: dimension,
    height: dimension,
    borderRadius: radius,
    backgroundColor: theme.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  const getTextSize = () => {
    switch (size) {
      case 'xs':
        return 'xs';
      case 'sm':
        return 'sm';
      case 'lg':
        return 'xl';
      case 'xl':
        return '2xl';
      case 'md':
      default:
        return 'md';
    }
  };

  if (uri && !hasError) {
    return (
      <View style={[containerStyle, style]}>
        <Image
          source={{ uri }}
          onError={() => setHasError(true)}
          style={{ width: dimension, height: dimension, borderRadius: radius }}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View style={[containerStyle, style]}>
      <Text
        size={getTextSize()}
        weight="semibold"
        color="secondary"
      >
        {getInitials(name)}
      </Text>
    </View>
  );
};
