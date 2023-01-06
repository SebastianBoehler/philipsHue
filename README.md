# Philips Hue API Wrapper

This is a Typescript package that provides a simple and easy-to-use wrapper around the Philips Hue API. It allows you to control your Philips Hue lights and other devices from your code.

## Installation

```
npm install @sebastianboehler/philipshue --registry=https://npm.pkg.github.com/
```

## Usage

To use the package, import it in your code and create a new instance of the PhilipsHue class:

```
import PhilipsHue from 'philipsHue'
import express from 'express.js

const port = process.env.PORT || 3000
const redirect_path = `/philipsHue_callback`

const myPhilips = new PhilipsHue({
  redirect_uri: `http://localhost:${port}${redirect_path}`,
  CLIENT_ID: 'YOUR_CLIENT_ID',
  CLIENT_SECRET: 'YOUR_CLIENT_SECRET'
})

const app = express()

app.get('/login', (req, res) => {
  const oAuthUrl = myPhilips.getOAuthUrl()
  res.redirect(oAuthUrl)
});

app.get(redirect_path, async (req, res) => {
  const { code } = req.query
  if (!code) {
    res.json({
      success: false
    })
    return
  }
  const success = await myPhilips.getAccessToken(code.toString())
  if (success) = await myPhilips.createWhitelistUser()
  res.json({
    success
  })
});

app.get('/scenes', async (req, res) => {
  const scenes = await myPhilips.getScenesV2()
  res.json(scenes)
});

app.listen(port, () => {
  console.log(`Sever listening on port ${port}`)
});
```

## Available methods

- `getOAuthurl()` returns your oAuth url
- `getAccessToken(code: string, grant_type = 'authorization_code')` stores access token, refresh token and expiration Date inside the class
- `refreshToken()` renews your access token
- `createWhitelistUser` whitelist your user
- `setLightState(id: string | number, state: LightStateV1)` lets you change the states of your light, turn them on/off, change color etc.
- `shouldRefreshAccessToken(aboutToExpireInNextSeconds: number = 90)` returns true if your access token is about to expire in next x seconds
- `setGroupState(id: string | number, state: LightStateV1 | {scene: string})` let you control whole groups in your home
- `getGroups()` returns all groups in your home
- `getLightsV2()` returns all lights in your home
- `getGroupsV2()` returns all groups in your home
- `getScenesV2()` returns all scenes
- `getSceneDetailsV2()` get a scene by its id
- `getSmartScenesV2()` returns all smart scenes
- `activateSceneV2(id: string)` activate a scene
- `activateSmartSceneV2(id: string)` activates a smart scene

Please note that not all methods from the V1 and V2 API are supported yet.
I'll try to update it as often as possible and extended it by the missing functions.
