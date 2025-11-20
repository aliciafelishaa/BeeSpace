import { NavItem } from "@/types/nav";
import {
    IconHome,
    IconMyRoom,
    IconCreateRoom,
    IconDirectMessage,
    IconProfile,
} from "@/components/ui/IconNavbar";

export const NAV_ITEMS: NavItem[] = [
    {
        id: "home",
        icon: IconHome,
        route: "/",
    },
    {
        id: "myroom",
        icon: IconMyRoom,
        route: "/yourroom/yourRoom",
    },
    {
        id: "createroom",
        icon: IconCreateRoom,
        route: "/createroom/page",
    },
    {
        id: "directmessage",
        icon: IconDirectMessage,
        route: "/directmessage/chatList",
    },
    {
        id: "profile",
        icon: IconProfile,
        route: "/profile",
    },
] as const;