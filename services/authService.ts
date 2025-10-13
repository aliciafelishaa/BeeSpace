import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/config/firebaseConfig"
import { getNextUserId } from "./userService"

export interface User {
    uid: number
    email: string
    createdAt: any
    profileCompleted: boolean
}

export const registerWithEmail = async (email: string, password: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const firebaseUid = userCredential.user.uid

    const sequentialUid = await getNextUserId()
    const now = new Date()

    await setDoc(doc(db, "users", firebaseUid), {
        uid: sequentialUid,
        email,
        fullName: "",
        username: "",
        university: "",
        major: "",
        enrollYear: "",
        gradYear: "",
        studentID: "",
        studentCard: null,
        profileCompleted: false,
        updatedAt: now,
        createdAt: now,
    })

    return {
        uid: sequentialUid,
        email,
        createdAt: now,
        profileCompleted: false,
    }
}


export const loginWithEmail = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const { uid } = userCredential.user
        return { uid, email }
    } catch (error: any) {
        throw error
    }
}
