export type UserId = string;
export type Username = string;
export type Url = string;
export type NumberFormatter = (n: number) => string;

// ——— Mode / Relationship ———
export type ProfileMode = "self" | "other";

/** Relasi current user → target profile */
export interface Relationship {
  isFollowing: boolean;
}

export type RelationshipState =
  | "owner"
  | "following"
  | "not_following"
  | "requested";

export interface FollowStats {
  following: number;
  followers: number;
}

export interface ProfileStats {
  rating?: number;     
  activeRooms: number;
  hostedRooms: number; 
  totalJoined: number; 
}


export interface ProfileActivity {
  roomsCreated: number;
  roomsJoined: number;
  activeRooms: number;
  rating?: number;
}

// ——— Core Profile ———
export interface UserProfile {
  id: UserId;
  name: string;
  username: Username;
  
  // ✅ Jadikan optional
  university?: string;
  major?: string;
  studentID?: string;
  enrollYear?: string;
  gradYear?: string;

  bio?: string;
  tagline?: string;
  avatarUrl?: string;

  isMe: boolean;
  relationship?: Relationship;
  followStats: FollowStats;
  stats: ProfileStats;
}

// Props komponen
export interface ProfileHeaderProps {
  profile: UserProfile;
  relation: RelationshipState; // turunan dari isMe/relationship
}

export interface StatsStripProps {
  stats: ProfileStats;
  onPressItem?: (key: "rating" | "active" | "hosted" | "joined") => void;
}

// API payload/DTO
export interface UpdateMyProfilePayload {
  name?: string;
  username?: Username; 
  avatarUrl?: Url;
  bio?: string;
  tagline?: string;
}

/* DTO hasil fetch dari backend.*/
export interface UserProfileDTO
  extends Omit<UserProfile, "isMe" | "relationship" | "stats"> {
  activity?: ProfileActivity;
  stats?: ProfileStats;
}

// helper adapter 
export const toProfileStats = (a: ProfileActivity): ProfileStats => ({
  rating: a.rating,
  activeRooms: a.activeRooms,
  hostedRooms: a.roomsCreated,
  totalJoined: a.roomsJoined,
});
