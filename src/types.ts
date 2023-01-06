export interface Smart_scene {
    id: string
    type: string
    metadata: {
        name: string
        image: {
            rid: string
            rtype: string
        }
    }
    group?: {
        rid: string
        rtype: string
    }
    week_timeslots: {
        timeslots: {
            start_time: {
                kind: string
                time: {
                    hour: number
                    minute: number
                    second: number
                }
            }
            target: {
                rid: string
                rtype: string
            }
        }[]
    }[]
    active_timeslot?: {
        timeslot_id: number
        weekday: string
    }
    state?: string
}

export interface Scene {
    id: string
    id_v1: string
    actions: {
        target: {
            rid: string
            rtype: string
        }
        action: Record<string, any>
    }[]
    metadata: {
        name: string
        image: {
            rid: string
            rtype: string
        }
    }
}

export interface Light {
    state: {
        on: boolean
        bri: number
        hue: number
        sat: number
        effect: string
        xy: [number, number]
        ct: number
        alert: string
        colormode: string
        mode: string
        reachable: boolean
    }
    swupdate: {
        state: string
        lastinstall: string
    }
    type: string
    name: string
    modelid: string
    manufacturername: string
    productname: string
    capabilities: {
        certified: boolean
        control: {
            mindimlevel: number
            maxlumen: number
            colorgamuttype: string
            colorgamut: [number, number][]
            ct: {
                min: number
                max: number
            }
        }
        streaming: {
            renderer: boolean
            proxy: boolean
        }
    }
    config: {
        archetype: string
        function: string
        direction: string
        startup: {
            mode: string
            configured: boolean
        }
    }
    uniqueid: string
    swversion: string
    swconfigid: string
    productid: string
}

export interface Group {
    name: string
    lights: string[]
    type: string
    action: {
        on: boolean
        bri: number
        hue: number
        sat: number
        effect: string
        xy: [number, number]
        ct: number
        alert: string
        colormode: string
    }
}

export interface LightV2 {
  type: string
  id: string
  id_v1: string
  owner: {
    rid: string
    rtype: string
  }
  metadata: {
    name: string
    archetype: string
    fixed_mired: number
  }
  on: {
    on: boolean
  }
  dimming: {
    brightness: number
    min_dim_level: number
  }
  color_temperature: {
    mirek: number
    mirek_valid: boolean
    mirek_schema: {
      mirek_minimum: number
      mirek_maximum: number
    }
  }
  color: {
    xy: {
      x: number
      y: number
    }
    gammut: {
      red: {
        x: number
        y: number
      }
      green: {
        x: number
        y: number
      }
      blue: {
        x: number
        y: number
      }
    }
    gammut_type: string
  }
  dynamics: {
    status: string
    status_values: string[]
    speed: number
    speed_valid: boolean
  }
  alert: {
    action_values: any[]
  }
  signaling: {
    status: {
      signal: string
      estimated_end: number
    }
  }
  mode: string
  gradient: {
    points: {
      color: {
        xy: {
          x: number
          y: number
        }
      }
    }[]
    mode: string
    points_capable: boolean
    mode_values: string[]
    pixel_count: number
  }
  effects: {
    effect: string
    status_values: string[]
    status: string
    effect_values: string[]
  }
  timed_effects: {
    effect: string
    duration: number
    status_values: string[]
    status: string
    effect_values: string[]
  }
  powerup: {
    preset: string
    configured: boolean
    on: {
      mode: string
      on: boolean
    }
    dimming: {
      mode: string
      dimming: {
        brightness: number
      }
    }
    color: {
      mode: string
      color_temperature: {
        mirek: number
      }
      color: {
        xy: {
          x: number
          y: number
        }
      }
    }
  }
}

export interface GroupedLightV2 {
    type: string
    id: string
    id_v1: string
    owner: {
      rid: string
      rtype: string
    }
    on: {
      on: boolean
    }
    dimming: {
      brightness: number
    }
    alert: {
      action_values: any[]
    }
}

export interface HueError {
    description: string
}

export interface LightStateV1 {
    on?: boolean
    bri?: number
    hue?: number
    sat?: number
    xy?: [number, number]
    ct?: number
    alert?: string
    effect?: string
    transitiontime?: number
    bri_inc?: number
    sat_inc?: number
    hue_inc?: number
    ct_inc?: number
    xy_inc?: [number, number]
}

export interface Config {
    redirect_uri: string
    CLIENT_ID: string
    CLIENT_SECRET: string
}
