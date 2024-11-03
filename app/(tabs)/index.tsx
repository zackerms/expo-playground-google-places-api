import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, SafeAreaView, Button, Alert } from "react-native";
import PlacesAutocomplete from "expo-google-places-autocomplete";
import Constants from "expo-constants";

export default function HomeScreen() {
  const [autoCompleteSearchResults, setAutoCompleteSearchResults] = useState<AutoCompleteSearchResult[]>([]);

  useEffect(() => {
    PlacesAutocomplete.initPlaces(Constants.expoConfig!.extra!.GOOGLE_PLACES_API_KEY);
  }, []);

  const onAutoComplete = useCallback(async() => {
    try{

      const result = await PlacesAutocomplete.findPlaces("紀伊國屋書店")
      setAutoCompleteSearchResults(result.places.map((place): AutoCompleteSearchResult => ({
        name: place.fullText, 
        description: place.description,
        distance: place.distance,
      })));

      Alert.prompt("DONE");
    } catch(e) {
      Alert.alert("ERROR")
      console.error(e)
    }
  }, []);

  return (
    <SafeAreaView style={{ paddingTop: 64 }}>
      <Button onPress={onAutoComplete} title="Search"/>
      <ScrollView>
        <View style={{ display: "flex", flexDirection: "column", gap: 16}}>
          {
            autoCompleteSearchResults.map((result, index) => (
              <Text key={index}>
                {result.name} {result.description} {result.distance}
              </Text>
            ))
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type AutoCompleteSearchResult = {
  name: string;
  description: string;
  distance: number | null;
}