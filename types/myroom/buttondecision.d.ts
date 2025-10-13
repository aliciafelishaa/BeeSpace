export interface ButtonDecisionProps {
  isOwner: boolean;
  hasJoined?: boolean;
  isEnded?: boolean;
  onDeleteRoom?: () => void;
}
