import { collection, query, where, getDocs, doc, updateDoc, runTransaction } from "firebase/firestore"
import { db } from "@/config/firebaseConfig"

export interface StudentProfile {
  fullName: string;
  username: string;
  university: string;
  major: string;
  enrollYear: string;
  gradYear: string;
  studentID: string;
  studentCard: string | null;
}

export const checkUsernameExists = async (username: string): Promise<boolean> => {
    try {
        const q = query(collection(db, "users"), where("username", "==", username))
        const querySnapshot = await getDocs(q)
        return !querySnapshot.empty
    } catch (error) {
        console.error("Error checking username:", error)
        return false
    }
}

export const updateUserProfile = async (firebaseUid: string, profileData: StudentProfile) => {
    try {
        const userRef = doc(db, "users", firebaseUid)
        await updateDoc(userRef, {
            fullName: profileData.fullName,
            username: profileData.username,
            university: profileData.university,
            major: profileData.major,
            enrollYear: profileData.enrollYear,
            gradYear: profileData.gradYear,
            studentID: profileData.studentID,
            studentCard: profileData.studentCard,
            profileCompleted: true,
            updatedAt: new Date(),
        })
    } catch (error: any) {
        throw error
    }
}

export const getNextUserId = async (): Promise<number> => {
  const counterRef = doc(db, "counters", "userCounter");

  const nextUid = await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    if (!counterDoc.exists()) {
      transaction.set(counterRef, { lastUid: 1 });
      return 1;
    }

    const lastUid = counterDoc.data().lastUid || 0;
    const newUid = lastUid + 1;
    transaction.update(counterRef, { lastUid: newUid });
    return newUid;
  });

  return nextUid;
};

// Field blm fix, kelihatannya cmn perlu name, avatar
export const getUserById = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        id: userId,
        name: data.fullName || "",
        avatar: data.avatar || null,
      };
    }
    return null;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
