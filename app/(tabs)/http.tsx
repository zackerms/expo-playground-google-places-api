import { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, SafeAreaView, Button, Alert, Pressable } from "react-native";
import PlacesAutocomplete from "expo-google-places-autocomplete";
import Constants from "expo-constants";
import axios from "axios";
import { applicationId, nativeApplicationVersion } from 'expo-application';
import { Platform } from 'react-native';

const locationSinjukuStation = {
  latitude: 35.690921,
  longitude: 139.700257,
};
const baseUrl = "https://maps.googleapis.com/maps/api/place";


export default function HttpScreen() {
  const [autoCompleteSearchResults, setAutoCompleteSearchResults] = useState<AutoCompleteSearchResult | null>(null);
  const [placeDetailSearchResult, setPlaceDetailResult] = useState<PlaceDetailSearchResult | null>(null);

    // https://cloud.google.com/docs/authentication/api-keys?hl=ja#android
  const requestHeader = useMemo(() => {
    return {
      "X-Android-Package": applicationId,
      // https://stackoverflow.com/questions/61518968/using-google-api-key-with-restriction-in-android
      "X-Android-Cert": (Constants.expoConfig!.extra!.ANDROID_FINGERPRINT as string).replaceAll(":", ""),
    }
  }, []);

  const onAutoComplete = useCallback(async () => {
    console.log({ headers: requestHeader })
    try {
      const response = await axios.get(
        `${baseUrl}/autocomplete/json`,
        {
          params: {
            input: "紀伊國屋書店",
            language: "ja",
            key: Constants.expoConfig!.extra!.GOOGLE_PLACES_API_KEY,
            radius: 10 * 1000,
            location: `${locationSinjukuStation.latitude},${locationSinjukuStation.longitude}`,
          },
          headers: requestHeader,
        }
      );


      if (response.data.status !== "OK") {
        throw new Error(
          "Google Places API Error: " + response.data.status
        );
      }

      setAutoCompleteSearchResults({
        predictions: response.data.predictions.map((prediction: any) => ({
          description: prediction.description,
          distanceMeters: prediction.distance_meters,
          matchedSubstrings: prediction.matched_substrings,
          placeId: prediction.place_id,
          structuredFormatting: {
            mainText: prediction.structured_formatting.main_text,
            secondaryText:
              prediction.structured_formatting.secondary_text,
            mainTextMatchedSubstrings:
              prediction.structured_formatting
                .main_text_matched_substrings,
          },
          terms: prediction.terms,
          types: prediction.types,
        })),
      })
      Alert.prompt("DONE");
    } catch (e) {
      Alert.alert("ERROR")
      console.error(e)
    }
  }, [applicationId]);

  const onPlaceDetail = useCallback(async (placeId: string) => {
    try {
      const response = await axios.get(`${baseUrl}/details/json`, {
        params: {
          place_id: placeId,
          language: "ja",
          key: Constants.expoConfig!.extra!.GOOGLE_PLACES_API_KEY,
          fields: "geometry",
        },
        headers: requestHeader,
      });

      if (response.data.status !== "OK") {
        throw new Error(
          "Google Places API Error: " + response.data.status
        );
      }

      const result = response.data.result;
      console.log({ result });
      setPlaceDetailResult({
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
      })
    } catch (e) {
      Alert.alert("ERROR")
      console.error(e)
    }
  }, []);

  return (
    <SafeAreaView style={{ paddingTop: 64 }}>
      <Button onPress={onAutoComplete} title="Search" />
      <ScrollView>
        <View style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {
            (autoCompleteSearchResults?.predictions || []).map((result, index) => (
              <Pressable
                key={index}
                onPress={() => onPlaceDetail(result.placeId)}
                style={{
                  display: "flex", flexDirection: "column",

                }}>
                <Text>
                  Description: {result.description}
                </Text>
              </Pressable>
            ))
          }
          {
            placeDetailSearchResult && <>
              <Text>#Detail</Text>
              <Text>
                位置情報： Lat {placeDetailSearchResult.latitude} Lng: {placeDetailSearchResult.longitude}
              </Text>
            </>
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type AutoCompleteSearchResult = {
  predictions: {
    description: string;
    distanceMeters: number;
    matchedSubstrings: {
      length: number;
      offset: number;
    }[];
    placeId: string;
    structuredFormatting: {
      mainText: string;
      mainTextMatchedSubstrings: {
        length: number;
        offset: number;
      }[];
      secondaryText: string;
    };
    terms: {
      offset: number;
      value: string;
    }[];
    types: string[];
  }[];
}

type PlaceDetailSearchResult = {
  latitude: number,
  longitude: number,
}