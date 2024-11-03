import {ConfigContext} from "@expo/config"

export default ({config}: ConfigContext) => {
    config.extra = {
        ...config.extra,
        GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
        ANDROID_FINGERPRINT: process.env.ANDROID_FINGERPRINT,
    }
    return config;
}