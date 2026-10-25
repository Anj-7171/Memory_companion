import { COLORS } from '../constants/colors';

export function useThemeColor(
  props: { light?: string; dark?: string } = {},
  colorName: keyof typeof COLORS = 'primary'
) {
  return props.dark ?? COLORS[colorName];
}
