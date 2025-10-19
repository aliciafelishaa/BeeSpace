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
    getDocs,
    query,
    setDoc,
    where,
} from "firebase/firestore"
import { getNextUserId } from "./userService"

WebBrowser.maybeCompleteAuthSession()

export interface User {
    uid: number
    email: string
    createdAt: any
    profileCompleted: boolean
}

export const registerWithEmail = async (
    email: string,
    password: string
): Promise<User> => {
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

export const sendResetPasswordEmail = async (email: string) => {
    const q = query(collection(db, "users"), where("email", "==", email))
    const querySnap = await getDocs(q)

    if (querySnap.empty) {
        throw new Error("EMAIL_NOT_REGISTERED")
    }

    try {
        const actionUrl =
            process.env.NODE_ENV === "development"
                ? "http://localhost:8081/auth/reset-pass"
                : "https://beespace.vercel.app/reset-pass"

        await sendPasswordResetEmail(auth, email, { url: actionUrl })
        return true
    } catch (error: any) {
        switch (error.code) {
            case "auth/invalid-email":
                throw new Error("INVALID_EMAIL")
            default:
                throw new Error("RESET_FAILED")
        }
    }
}

export function useGoogleAuth() {
    const redirectUri = makeRedirectUri({
        useProxy: true,
        scheme: "beespace",
    })

    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: process.env.EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
        redirectUri,
        scopes: ["profile", "email"],
    })

    const handleGoogleResponse = async () => {
        if (response?.type === "success" && response.authentication?.idToken) {
            const credential = GoogleAuthProvider.credential(response.authentication.idToken)

            const userCredential = await signInWithCredential(auth, credential)
            const user = userCredential.user
            const q = query(collection(db, "users"), where("email", "==", user.email))
            const querySnap = await getDocs(q)

            if (querySnap.empty) {
                const sequentialUid = await getNextUserId()
                const now = new Date()

                await setDoc(doc(db, "users", user.uid), {
                    uid: sequentialUid,
                    email: user.email,
                    fullName: user.displayName ?? "",
                    username: user.displayName ? user.displayName.split(" ")[0] : "",
                    profileCompleted: false,
                    createdAt: now,
                    updatedAt: now,
                })
            }

            return { uid: user.uid, email: user.email }
        } else if (response?.type === "error") {
            throw new Error(`Google login failed: ${response.error?.message || "Unknown error"}`)
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
