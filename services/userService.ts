import { doc, updateDoc, runTransaction } from "firebase/firestore"
import { db } from "@/config/firebaseConfig"

export interface StudentProfile {
  fullName: string
  username: string
  university: string
  major: string
  enrollYear: string
  gradYear: string
  studentID: string
  studentCard: string | null
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
  const counterRef = doc(db, "counters", "userCounter")

  const nextUid = await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef)
    if (!counterDoc.exists()) {
      transaction.set(counterRef, { lastUid: 1 })
      return 1
    }

    const lastUid = counterDoc.data().lastUid || 0
    const newUid = lastUid + 1
    transaction.update(counterRef, { lastUid: newUid })
    return newUid
  })

  return nextUid
}
