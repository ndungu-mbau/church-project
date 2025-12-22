import { useCSSVariable } from "uniwind";

export type ThemeColor =
  | "background"
  | "foreground"
  | "card"
  | "card-foreground"
  | "popover"
  | "popover-foreground"
  | "primary"
  | "primary-foreground"
  | "secondary"
  | "secondary-foreground"
  | "muted"
  | "muted-foreground"
  | "accent"
  | "accent-foreground"
  | "destructive"
  | "destructive-foreground"
  | "border"
  | "input"
  | "ring"
  | "success"
  | "success-foreground"
  | "danger"
  | "danger-foreground";

/**
 * Custom hook to resolve shadcn theme colors defined in global.css
 */
export const useThemeColor = (color: ThemeColor): string => {
  const cssVariable = `--color-${color}`;
  const resolvedColor = useCSSVariable(cssVariable);

  // Fallback to a safe color if the variable is not found
  // In a real application, you might want a default based on the color key
  return (resolvedColor as string) ?? "#FF0000";
};
