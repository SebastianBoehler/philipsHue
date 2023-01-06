# Philips Hue API Wrapper

This is a Typescript package that provides a simple and easy-to-use wrapper around the Philips Hue API. It allows you to control your Philips Hue lights and other devices from your code.

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

app.get(redirect_uri, async (req, res) => {
  const { code } = req.query
  if (!code) {
    res.json({
      success: false
    })
    return
  }
  const success = await myPhilips.getAccessToken(code.toString())
  res.json({
    success
  })
});

app.listen(port, () => {
  console.log(`Sever listening on port ${port}`)
});
```
