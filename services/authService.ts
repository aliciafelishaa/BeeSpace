import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { collection, getDocs, query, where, setDoc, doc } from "firebase/firestore"
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
    const sequentialUid = await getNextUserId()
    const now = new Date()

    await setDoc(doc(db, "users", userCredential.user.uid), {
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

    const q = query(collection(db, "users"), where("email", "==", email))
    const querySnap = await getDocs(q)

    if (querySnap.empty) {
        throw new Error("EMAIL_NOT_REGISTERED")
    }

    const userData = querySnap.docs[0].data()

    try {
        await signInWithEmailAndPassword(auth, email, password)
        return { uid: userData.uid, email }
    } catch (error: any) {
        throw new Error("PASSWORD_INCORRECT")
    }
}
