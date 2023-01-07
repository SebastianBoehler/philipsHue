import { Config, Group, GroupedLightV2, HueError, LightStateV1, LightV2, Scene, Smart_scene } from './types'

export default class philipsHue {
  private redirect_uri: string
  public colors: {
    [key: string]: [number, number]
  }
  private access_token ? : string
  private refresh_token ? : string
  public expires_at ? : number
  private username ? : string
  private config: Config

  constructor(config: Config) {
    this.config = config
    this.colors = {
      red: [0.75, 0.27],
      orange: [0.6, 0.39],
      green: [0.3, 0.6],
    }
    this.redirect_uri = config.redirect_uri
  }

  public getOAuthUrl() {
    return `https://api.meethue.com/v2/oauth2/authorize?client_id=${process.env.HUE_ID}&redirect_uri=${encodeURIComponent(this.redirect_uri)}&response_type=code&state=${Date.now()}`
  }

  public async getAccessToken(code: string, grant_type = 'authorization_code') {
    const response = await fetch('https://api.meethue.com/v2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${this.config.CLIENT_ID}:${this.config.CLIENT_SECRET}`).toString('base64')}`,

      },
      body: `grant_type=${grant_type}&code=${code}`,
    })
    const data = await response.json()

    if (response.status === 200) {
      this.access_token = data.access_token
      this.refresh_token = data.refresh_token
      this.expires_at = new Date().getTime() + data.expires_in * 1000
      return true
    }

    return false
  }

  public async refreshToken() {
    const resp = await fetch('https://api.meethue.com/v2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${this.config.CLIENT_ID}:${this.config.CLIENT_SECRET}`).toString('base64')}`,
      },
      body: `grant_type=refresh_token&refresh_token=${this.refresh_token}`,
    })
    const data = await resp.json()

    if (resp.status === 200) {
      this.access_token = data.access_token
      this.refresh_token = data.refresh_token
      this.expires_at = new Date().getTime() + data.expires_in * 1000
      return true
    }

    return false
  }

  public async createWhitelistUser() {
    await fetch(`https://api.meethue.com/route/api/0/config`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        linkbutton: true,
      })
    })

    const resp = await fetch(`https://api.meethue.com/route/api/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        devicetype: 'sebastians hue app',
      })
    })

    if (resp.status === 200) {
      const data: [{ success: { username: string } }] = await resp.json()
      this.username = data[0].success.username
      return true
    }

    return false
  }

  public async setLightState(id: string | number, state: LightStateV1 ) {
    const resp = await fetch(`https://api.meethue.com/route/api/${this.username}/lights/${id}/state`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state),
    })

    const status = resp.status
    if (status === 200) {
      const data: {success: {[key: string]: number | boolean | [number, number]}}[] = await resp.json()
      return data
    }

    if (status === 201) {
      throw new Error(`Seems like you tried to change attributes while the light is off.`)
    }
  }

  public async shouldRefreshAccessToken(aboutToExpireInNextSeconds: number = 90) {
    const now = new Date()
    now.setSeconds(now.getSeconds() - aboutToExpireInNextSeconds)
    if (this.expires_at && this.expires_at < now.getTime()) {
      return true
    }

    return false
  }

  public async setGroupState(id: string | number, state: LightStateV1 | {scene: string} ) {
    const response = await fetch(`https://api.meethue.com/route/api/${this.username}/groups/${id}/action`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state),
    })

    const status = response.status
    if (status === 200) {
      const data: {success: {[key: string]: string | boolean | number}}[] = await response.json()
      return {
        success: true,
        data,
      }
    }

    return {
      success: false,
      data: await response.json(),
    }
  }

  public async getGroups() {
    const resp = await fetch(`https://api.meethue.com/route/api/${this.username}/groups`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.access_token}`,
      }
    })

    const json: {[id: string]: Group} = await resp.json()

    if (resp.status === 200) {
      return {
        success: true,
        data: json,
      }
    }

    return {
      success: false,
      errors: json,
    }
  }

  public async getLightsV2() {
    const resp = await fetch(`https://api.meethue.com/route/clip/v2/resource/light`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.access_token}`,
        'hue-application-key': this.username!,
      }
    })

    const json: {
      errors: HueError[],
      data: LightV2[]
    } = await resp.json()

    if (resp.status === 200) {
      return {
        success: true,
        data: json.data,
      }
    }

    return {
      success: false,
      errors: json.errors,
    }
  }

  public async getGroupsV2() {
    const resp = await fetch(`https://api.meethue.com/route/clip/v2/resource/grouped_light`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.access_token}`,
        'hue-application-key': this.username!,
      }
    })

    const json: {
      errors: HueError[],
      data: GroupedLightV2[]
    } = await resp.json()

    if (resp.status === 200) {
      return {
        success: true,
        data: json.data,
      }
    }

    return {
      success: false,
      errors: json.errors,
    }
  }

  public async getScenesV2() {
    const resp = await fetch(`https://api.meethue.com/route/clip/v2/resource/scene`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.access_token}`,
        'hue-application-key': this.username!,
      },
    })

    const json: {
        errors: HueError[]
        data: Scene[]
      } = await resp.json()

    if (resp.status === 200) {
      return {
        success: true,
        data: json.data,
      }
    }

    return {
      success: false,
      errors: json.errors,
    }
  }

  public async getSceneDetailsV2(id: string | number) {
    const resp = await fetch(`https://api.meethue.com/route/clip/v2/resource/scene/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.access_token}`,
        'hue-application-key': this.username!,
      }
    })

    const json: {
        errors: HueError[]
        data: Scene
      } = await resp.json()

    if (resp.status === 200) {
      return {
        success: true,
        data: json.data,
      }
    }

    return {
      success: false,
      errors: json.errors,
    }
  }

  public async getSmartScenesV2() {
    const resp = await fetch(`https://api.meethue.com/route/clip/v2/resource/smart_scene`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.access_token}`,
        'hue-application-key': this.username!,
      }
    })

    const json: {
       errors: HueError[]
      data: Smart_scene[]
    } = await resp.json()

    if (resp.status === 200) {
      return {
        success: true,
        data: json.data,
      }
    }

    return {
      success: false,
      errors: json.errors,
    }
  }

  public async activateSceneV2(id: string) {
    const resp = await fetch(`https://api.meethue.com/route/clip/v2/resource/scene/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.access_token}`,
        'hue-application-key': this.username!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auto_dynamic: true,
        recall: {
          action: 'active',
          status: 'active'
        }
      })
    })

    const json: {
      errors: HueError[]
      data: {rid: string, rtype: string}[]
    } = await resp.json()

    if (resp.status === 200) {
      return {
        success: true,
        data: json.data,
      }
    }

    return {
      success: false,
      errors: json.errors,
    }
  }

  public async activateSmartSceneV2(id: string) {
    const resp = await fetch(`https://api.meethue.com/route/clip/v2/resource/smart_scene/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.access_token}`,
        'hue-application-key': this.username!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auto_dynamic: true,
        recall: {
          action: 'activate',
        },
      })
    })

    const json: {
      errors: HueError[]
      data: {rid: string, rtype: string}[]
    } = await resp.json()

    if (resp.status === 200) {
      return {
        success: true,
        data: json.data,
      }
    }

    return {
      success: false,
      errors: json.errors,
    }
  }
}
