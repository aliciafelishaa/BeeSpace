export type RoomCategory =
  | "all"
  | "sport"
  | "category"
  | "hangout"
  | "learning"
  | "events"
  | "hobby";

export interface TabButtonProps {
  title: string;
  icon: any;
  activeIcon: any;
  active: boolean;
  onPress: () => void;
}
export type TimeCategory = "today" | "thisweek" | "thismonth" | "mycampus";

export interface TimeCategoryProps {
  title: string;
  active: boolean;
  onPress: () => void;
}
