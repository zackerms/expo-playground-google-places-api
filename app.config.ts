import {ConfigContext} from "@expo/config"

export default ({config}: ConfigContext) => {
    config.extra = {
        ...config.extra,
        GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY
    }
    return config;
}