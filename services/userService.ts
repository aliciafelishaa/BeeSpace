import { collection, query, where, getDocs, doc, updateDoc, getDoc } from "firebase/firestore"
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
    profilePicture: string | null
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
            ...profileData,
            profileCompleted: true,
            updatedAt: new Date(),
        })
    } catch (error: any) {
        throw error
    }
}

export const checkUserProfileCompletion = async (firebaseUid: string): Promise<boolean> => {
    try {
        const userRef = doc(db, "users", firebaseUid)
        const userDoc = await getDoc(userRef)
        
        if (userDoc.exists()) {
            return userDoc.data().profileCompleted === true
        }
        
        return false
    } catch (error) {
        console.error("Error checking profile completion:", error)
        return false
    }
}