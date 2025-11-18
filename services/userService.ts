import { db } from "@/config/firebaseConfig";
import { UserProfile } from "@/types/profile/profile";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

export interface StudentProfile {
  fullName: string;
  username: string;
  university: string;
  major: string;
  enrollYear: string;
  gradYear: string;
  studentID: string;
  studentCard: string | null;
  profilePicture: string | null;
}

export interface FirebaseUserData {
  fullName: string;
  username: string;
  email: string;
  profilePicture: string | null;
  bio: string;
  university: string;
  major: string;
  enrollYear: string;
  gradYear: string;
  studentID: string;
  studentCard: string | null;
  followersCount: number;
  followingCount: number;
  hostedRoomsCount: number;
  totalJoinedCount: number;
  activeRoomsCount: number;
  rating: number;
  profileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const getUserById = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        id: userId,
        name: data.fullName || "",
        avatarUrl: data.profilePicture || undefined,
        avatar: data.profilePicture || null,
        university: data.university || "",
        username: data.username || "",
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

export const getFullUserProfile = async (
  userId: string,
  currentUserId?: string
): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));

    if (!userDoc.exists()) {
      console.log("User not found:", userId);
      return null;
    }

    const data = userDoc.data() as FirebaseUserData;

    const profile: UserProfile = {
      id: userId,
      name: data.fullName || "",
      username: data.username || "",
      avatarUrl: data.profilePicture || undefined,
      bio: data.bio || "",
      isMe: currentUserId === userId,
      followStats: {
        followers: data.followersCount || 0,
        following: data.followingCount || 0,
      },
      stats: {
        hostedRooms: data.hostedRoomsCount || 0,
        totalJoined: data.totalJoinedCount || 0,
        activeRooms: data.activeRoomsCount || 0,
        rating: data.rating || 0,
      },
    };

    if (currentUserId && currentUserId !== userId) {
      profile.relationship = await getUserRelationship(currentUserId, userId);
    }

    return profile;
  } catch (error) {
    console.error("Error fetching full profile:", error);
    return null;
  }
};

export const checkUsernameExists = async (
  username: string
): Promise<boolean> => {
  try {
    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking username:", error);
    return false;
  }
};

export const updateUserProfile = async (
  firebaseUid: string,
  profileData: any
) => {
  try {
    const userRef = doc(db, "users", firebaseUid);

    console.log("🔵 Firebase updateDoc called for:", firebaseUid);
    console.log("🔵 Data:", profileData);

    await updateDoc(userRef, {
      ...profileData,
      updatedAt: new Date(),
    });

    console.log("✅ Firebase update successful");
  } catch (error: any) {
    console.error("❌ Firebase update error:", error);
    throw error;
  }
};

export const checkUserProfileCompletion = async (
  firebaseUid: string
): Promise<boolean> => {
  try {
    const userRef = doc(db, "users", firebaseUid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data().profileCompleted === true;
    }
    return false;
  } catch (error) {
    console.error("Error checking profile completion:", error);
    return false;
  }
};

export const createUserDocument = async (
  userId: string,
  userData: {
    email: string;
    fullName?: string;
    username?: string;
  }
) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      fullName: userData.fullName || "",
      username: userData.username || "",
      email: userData.email,
      profilePicture: null,
      bio: "",
      university: "",
      major: "",
      enrollYear: "",
      gradYear: "",
      studentID: "",
      studentCard: null,
      followersCount: 0,
      followingCount: 0,
      hostedRoomsCount: 0,
      totalJoinedCount: 0,
      activeRoomsCount: 0,
      rating: 0,
      profileCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("✅ User document created");
  } catch (error) {
    console.error("❌ Error creating user document:", error);
    throw error;
  }
};

export const updateRoomStats = async (
  userId: string,
  updates: {
    hostedRooms?: number;
    totalJoined?: number;
    activeRooms?: number;
  }
) => {
  try {
    const userRef = doc(db, "users", userId);
    const updateData: any = { updatedAt: new Date() };

    if (updates.hostedRooms !== undefined) {
      updateData.hostedRoomsCount = increment(updates.hostedRooms);
    }
    if (updates.totalJoined !== undefined) {
      updateData.totalJoinedCount = increment(updates.totalJoined);
    }
    if (updates.activeRooms !== undefined) {
      updateData.activeRoomsCount = increment(updates.activeRooms);
    }

    await updateDoc(userRef, updateData);
  } catch (error) {
    console.error("Error updating room stats:", error);
  }
};

export const updateUserRating = async (userId: string, newRating: number) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      rating: newRating,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating rating:", error);
  }
};

export const getUserRelationship = async (
  currentUserId: string,
  targetUserId: string
) => {
  try {
    const followDoc = await getDoc(
      doc(db, "users", currentUserId, "following", targetUserId)
    );
    return {
      isFollowing: followDoc.exists(),
    };
  } catch (error) {
    console.error("Error getting relationship:", error);
    return { isFollowing: false };
  }
};

export const followUser = async (
  currentUserId: string,
  targetUserId: string
) => {
  try {
    await setDoc(doc(db, "users", currentUserId, "following", targetUserId), {
      createdAt: new Date(),
    });
    await setDoc(doc(db, "users", targetUserId, "followers", currentUserId), {
      createdAt: new Date(),
    });
    await incrementFollowingCount(currentUserId);
    await incrementFollowersCount(targetUserId);
    console.log("✅ Followed user");
  } catch (error) {
    console.error("❌ Error following user:", error);
    throw error;
  }
};

export const unfollowUser = async (
  currentUserId: string,
  targetUserId: string
) => {
  try {
    await deleteDoc(doc(db, "users", currentUserId, "following", targetUserId));
    await deleteDoc(doc(db, "users", targetUserId, "followers", currentUserId));
    await decrementFollowingCount(currentUserId);
    await decrementFollowersCount(targetUserId);
    console.log("✅ Unfollowed user");
  } catch (error) {
    console.error("❌ Error unfollowing user:", error);
    throw error;
  }
};

export const getFollowersList = async (userId: string) => {
  try {
    const followersSnap = await getDocs(
      collection(db, "users", userId, "followers")
    );
    const followerIds = followersSnap.docs.map((doc) => doc.id);
    const followers = await Promise.all(
      followerIds.map((id) => getUserById(id))
    );
    return followers.filter((f) => f !== null);
  } catch (error) {
    console.error("Error getting followers:", error);
    return [];
  }
};

export const getFollowingList = async (userId: string) => {
  try {
    const followingSnap = await getDocs(
      collection(db, "users", userId, "following")
    );
    const followingIds = followingSnap.docs.map((doc) => doc.id);
    const following = await Promise.all(
      followingIds.map((id) => getUserById(id))
    );
    return following.filter((f) => f !== null);
  } catch (error) {
    console.error("Error getting following:", error);
    return [];
  }
};

export const incrementFollowersCount = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      followersCount: increment(1),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error incrementing followers:", error);
  }
};

export const decrementFollowersCount = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      followersCount: increment(-1),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error decrementing followers:", error);
  }
};

export const incrementFollowingCount = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      followingCount: increment(1),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error incrementing following:", error);
  }
};

export const decrementFollowingCount = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      followingCount: increment(-1),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error decrementing following:", error);
  }
};
