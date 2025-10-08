import { NavItem } from "@/types/nav";

export const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    icon: require("@/assets/utils/passive-icon/home.png"),
    activeIcon: require("@/assets/utils/active-icon/home.png"),
    route: "/",
  },
  {
    id: "myroom",
    icon: require("@/assets/utils/passive-icon/myroom.png"),
    activeIcon: require("@/assets/utils/active-icon/myroom.png"),
    route: "/myroom/roomDashboard.tsx",
  },
  {
    id: "createroom",
    icon: require("@/assets/utils/passive-icon/create.png"),
    activeIcon: require("@/assets/utils/active-icon/create.png"),
    route: "/createroom/page",
  },
  {
    id: "directmessage",
    icon: require("@/assets/utils/passive-icon/dm.png"),
    activeIcon: require("@/assets/utils/active-icon/dm.png"),
    route: "/directmessage/dm-homepage",
  },
  {
    id: "profile",
    icon: require("@/assets/utils/passive-icon/profile.png"),
    activeIcon: require("@/assets/utils/active-icon/profile.png"),
    route: "/auth/login",
  },
] as const;
