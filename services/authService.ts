import { auth, db } from "@/config/firebaseConfig"
import { makeRedirectUri } from "expo-auth-session"
import * as Google from "expo-auth-session/providers/google"
import * as WebBrowser from "expo-web-browser"
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithCredential,
    signInWithEmailAndPassword,
} from "firebase/auth"
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    where,
} from "firebase/firestore"
import { signOut } from "firebase/auth"

WebBrowser.maybeCompleteAuthSession()

export interface User {
    uid: string
    email: string
    createdAt: any
    profileCompleted: boolean
}

const defaultUserProfile = (email: string, displayName = "") => {
    const now = new Date()
    return {
        email,
        fullName: displayName,
        username: displayName ? displayName.split(" ")[0] : "",
        university: "",
        major: "",
        enrollYear: "",
        gradYear: "",
        studentID: "",
        studentCard: null,
        profileCompleted: false,
        createdAt: now,
        updatedAt: now,
    }
}

export const registerWithEmail = async (
    email: string,
    password: string
): Promise<User> => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await setDoc(doc(db, "users", user.uid), defaultUserProfile(email))
    const now = new Date()
    return { uid: user.uid, email, createdAt: now, profileCompleted: false }
}

export const loginWithEmail = async (email: string, password: string) => {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password)
        return { uid: user.uid, email }
    } catch (error: any) {
        if (["auth/user-not-found", "auth/invalid-credential"].includes(error.code))
            throw new Error("INVALID_CREDENTIALS")
        throw new Error("LOGIN_FAILED")
    }
}

export const sendResetPasswordEmail = async (email: string) => {
    const q = query(collection(db, "users"), where("email", "==", email))
    const querySnap = await getDocs(q)
    if (querySnap.empty) throw new Error("EMAIL_NOT_REGISTERED")
    try {
        await sendPasswordResetEmail(auth, email, {
            url: "http://localhost:8081/auth/reset-pass",
        })
        return true
    } catch (error: any) {
        if (error.code === "auth/invalid-email") throw new Error("INVALID_EMAIL")
        throw new Error("RESET_FAILED")
    }
}

export const getCurrentUser = () => {
    return auth.currentUser
}

export const getCurrentUserData = async () => {
    try {
        const user = auth.currentUser
        if (!user) return null

        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
            const data = userDoc.data()
            return {
                id: user.uid,
                email: user.email,
                ...data,
            }
        }
        return null
    } catch (err) {
        console.error("Error:", err)
        return null
    }
}

export function useGoogleAuth() {
    const redirectUri = makeRedirectUri({ useProxy: true, scheme: "beespace" })
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: process.env.EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
        redirectUri,
        scopes: ["profile", "email"],
    })

    const handleGoogleResponse = async () => {
        if (response?.type === "success" && response.authentication?.idToken) {
            const credential = GoogleAuthProvider.credential(
                response.authentication.idToken
            )
            const { user } = await signInWithCredential(auth, credential)
            const q = query(
                collection(db, "users"),
                where("email", "==", user.email)
            )
            const querySnap = await getDocs(q)
            if (querySnap.empty)
                await setDoc(
                    doc(db, "users", user.uid),
                    defaultUserProfile(user.email!, user.displayName ?? "")
                )
            return { uid: user.uid, email: user.email }
        } else if (response?.type === "error") {
            throw new Error(
                `Google login failed: ${response.error?.message || "Unknown error"}`
            )
        }
        return null
    }

    return {
        request,
        response,
        promptAsync: () => promptAsync({ useProxy: true }),
        handleGoogleResponse,
    }
}

export const logout = async (): Promise<boolean> => {
    try {
        await signOut(auth)
        console.log("✅ Logout successful")
        return true
    } catch (error) {
        console.error("❌ Logout error:", error)
        return false
    }
}