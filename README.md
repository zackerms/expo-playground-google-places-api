# Welcome to your Expo app 👋

## Google Places APIをインストール
https://github.com/alanjhughes/expo-google-places-autocomplete
```sh
npx expo install expo-google-places-autocomplete
```

## Prebuild
パッケージ名やfingerprintでAPIキーを制限するためにビルドをする必要がある
```sh
yarn expo prebuild --platform android
```

- 起動とビルド
```sh
yarn android
```

- finger printを取得
https://zenn.dev/garnet3106/articles/eb432898e247c6
```sh
keytool -list -v -keystore ./android/app/debug.keystore
```

## APIキーを発行
- API制限：Google Places API
- アプリケーション制限
    - パッケージ名: com.playground.expo.placesapi (app.jsonに記載)
    - fingerprint
```
// .env.local
GOOGLE_PLACES_API_KEY=
```