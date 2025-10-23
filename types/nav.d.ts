export interface NavItem {
  id: string;
  icon: any;
  activeIcon: any;
  route: string;
}

export interface BottomNavProps {
  items: NavItem[];
  activeId: string;
  onSelect: (id: string, route: string) => void;
}
// s
