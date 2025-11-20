export interface NavItem {
  id: string;
  icon: React.ComponentType<{ isActive?: boolean }>;
  route: string;
}

export interface BottomNavProps {
  items: NavItem[];
  activeId: string;
  onSelect: (id: string, route: string) => void;
}