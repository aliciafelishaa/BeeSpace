import * as Google from "expo-auth-session/providers/google"
import { auth, GoogleProviderClass } from "@/config/firebaseConfig"
import { signInWithCredential } from "firebase/auth"

const EXPO_REDIRECT_URI = "https://auth.expo.io/@pisciva/BeeSpace"

export const useGoogleAuth = () => {
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_FIREBASE_IOS_CLIENT_ID,
        redirectUri: EXPO_REDIRECT_URI,
        scopes: ["profile", "email"],
    })

    const signInWithGoogle = async () => {
        const result = await promptAsync()

        if (result.type === "success" && result.authentication?.idToken) {
            const credential = GoogleProviderClass.credential(
                result.authentication.idToken,
                result.authentication.accessToken
            )
            return signInWithCredential(auth, credential)
        }

        throw new Error("Google Sign In canceled or failed")
    }

    return { signInWithGoogle, request, response }
}