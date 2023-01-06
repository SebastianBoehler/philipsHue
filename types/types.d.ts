export interface Smart_scene {
    id: string;
    type: string;
    metadata: {
        name: string;
        image: {
            rid: string;
            rtype: string;
        };
    };
    group?: {
        rid: string;
        rtype: string;
    };
    week_timeslots: {
        timeslots: {
            start_time: {
                kind: string;
                time: {
                    hour: number;
                    minute: number;
                    second: number;
                };
            };
            target: {
                rid: string;
                rtype: string;
            };
        }[];
    }[];
    active_timeslot?: {
        timeslot_id: number;
        weekday: string;
    };
    state?: string;
}
export interface Scene {
    id: string;
    id_v1: string;
    actions: {
        target: {
            rid: string;
            rtype: string;
        };
        action: Record<string, any>;
    }[];
    metadata: {
        name: string;
        image: {
            rid: string;
            rtype: string;
        };
    };
}
export interface Light {
    state: {
        on: boolean;
        bri: number;
        hue: number;
        sat: number;
        effect: string;
        xy: [number, number];
        ct: number;
        alert: string;
        colormode: string;
        mode: string;
        reachable: boolean;
    };
    swupdate: {
        state: string;
        lastinstall: string;
    };
    type: string;
    name: string;
    modelid: string;
    manufacturername: string;
    productname: string;
    capabilities: {
        certified: boolean;
        control: {
            mindimlevel: number;
            maxlumen: number;
            colorgamuttype: string;
            colorgamut: [number, number][];
            ct: {
                min: number;
                max: number;
            };
        };
        streaming: {
            renderer: boolean;
            proxy: boolean;
        };
    };
    config: {
        archetype: string;
        function: string;
        direction: string;
        startup: {
            mode: string;
            configured: boolean;
        };
    };
    uniqueid: string;
    swversion: string;
    swconfigid: string;
    productid: string;
}
export interface GroupedLightV2 {
    type: string;
    id: string;
    id_v1: string;
    owner: {
        rid: string;
        rtype: string;
    };
    on: {
        on: boolean;
    };
    dimming: {
        brightness: number;
    };
    alert: {
        action_values: any[];
    };
}
export interface HueError {
    description: string;
}
export interface LightStateV1 {
    on?: boolean;
    bri?: number;
    hue?: number;
    sat?: number;
    xy?: [number, number];
    ct?: number;
    alert?: string;
    effect?: string;
    transitiontime?: number;
    bri_inc?: number;
    sat_inc?: number;
    hue_inc?: number;
    ct_inc?: number;
    xy_inc?: [number, number];
}
export interface Config {
    redirect_uri: string;
    CLIENT_ID: string;
    CLIENT_SECRET: string;
}
