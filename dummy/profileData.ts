import { UserProfile } from "@/types/profile/profile";

export const mockProfile: UserProfile = {
  id: "1",
  name: "Tasya Jenner",
  username: "tasyajenner",
  avatarUrl: require("@/assets/profile/empty-profile.jpg"), 
  bio: "I believe I can fly || B27 || Computer Science\nInstagram: tasyapndya",

  isMe: true,

  followStats: {
    following: 127,
    followers: 208,
  },

  stats: {
    hostedRooms: 12,
    totalJoined: 21,
    activeRooms: 5,
    rating: 4.9,
  },
};

export const mockProfiles: UserProfile[] = [
  mockProfile,
  {
    id: "2",
    name: "Alicia F",
    username: "aliciafl",
    avatarUrl: "https://randomuser.me/api/portraits/women/2.jpg",
    bio: "UI/UX enthusiast | Coffee over chaos ☕",
    isMe: false,
    relationship: { isFollowing: true },
    followStats: {
      following: 345,
      followers: 290,
    },
    stats: {
      hostedRooms: 8,
      totalJoined: 15,
      activeRooms: 3,
      rating: 4.8,
    },
  },
  {
    id: "3",
    name: "Akbar R",
    username: "akbarr",
    avatarUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    bio: "Backend developer & open source contributor",
    isMe: false,
    relationship: { isFollowing: false },
    followStats: {
      following: 120,
      followers: 175,
    },
    stats: {
      hostedRooms: 4,
      totalJoined: 9,
      activeRooms: 1,
      rating: 4.6,
    },
  },
];
