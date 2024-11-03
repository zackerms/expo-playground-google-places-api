import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, SafeAreaView, Button, Alert, Pressable } from "react-native";
import PlacesAutocomplete from "expo-google-places-autocomplete";
import Constants from "expo-constants";

export default function HomeScreen() {
  const [autoCompleteSearchResults, setAutoCompleteSearchResults] = useState<AutoCompleteSearchResult[]>([]);
  const [placeDetailResult, setPlaceDetailResult] = useState<PlaceDetailSearchResult | null>(null);

  useEffect(() => {
    PlacesAutocomplete.initPlaces(Constants.expoConfig!.extra!.GOOGLE_PLACES_API_KEY);
  }, []);

  const onAutoComplete = useCallback(async () => {
    try {
      const result = await PlacesAutocomplete.findPlaces("紀伊國屋書店")
      setAutoCompleteSearchResults(result.places.map((place): AutoCompleteSearchResult => ({
        primaryText: place.primaryText,
        secondaryText: place.secondaryText,
        fullText: place.fullText,
        description: place.description,
        placeId: place.placeId,
        distance: place.distance,
        types: place.types,
      })));

      Alert.prompt("DONE");
    } catch (e) {
      Alert.alert("ERROR")
      console.error(e)
    }
  }, []);

  const onPlaceDetail = useCallback(async (placeId: string) => {
    try {
      const result = await PlacesAutocomplete.placeDetails(placeId);
      result.formattedAddress
      setPlaceDetailResult({
        name: result.name,
        formattedAddress: result.formattedAddress,
        latitude: result.coordinate.latitude,
        longitude: result.coordinate.longitude,
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
            autoCompleteSearchResults.map((result, index) => (
              <Pressable
                key={index}
                onPress={() => onPlaceDetail(result.placeId)}
                style={{
                  display: "flex", flexDirection: "column",

                }}>
                <Text               >
                  Primary: {result.primaryText}               
                </Text>
                <Text>
                  Secondary: {result.secondaryText}
                </Text>
                <Text>
                  Full: {result.fullText}
                </Text>
                <Text>
                  Description: {result.description}
                </Text>
                <Text>
                  Distance: {result.distance}
                </Text>
                <Text>
                  Types: {result.types.join(",")}
                </Text>
              </Pressable>
            ))
          }
          {
            placeDetailResult && <>
              <Text>#Detail</Text>
              <Text>
                {placeDetailResult?.name} {placeDetailResult?.formattedAddress} {placeDetailResult.latitude} {placeDetailResult.longitude}
              </Text>
            </>
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type AutoCompleteSearchResult = {
  primaryText: string;
  secondaryText: string;
  fullText: string;
  description: string;
  placeId: string;
  distance: number | null;
  types: string[];
}

type PlaceDetailSearchResult = {
  name?: string;
  formattedAddress?: string,
  latitude: number,
  longitude: number,
}