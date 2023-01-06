import { Config, GroupedLightV2, HueError, LightStateV1, Scene, Smart_scene } from './types';
export default class philipsHue {
    private redirect_uri;
    colors: {
        [key: string]: [number, number];
    };
    private access_token?;
    private refresh_token?;
    expires_at?: number;
    private username?;
    private config;
    constructor(config: Config);
    getOAuthUrl(): string;
    getAccessToken(code: string, grant_type?: string): Promise<boolean>;
    refreshToken(): Promise<boolean>;
    createWhitelistUser(): Promise<boolean>;
    setLightState(id: string | number, state: LightStateV1): Promise<{
        success: {
            [key: string]: number | boolean | [number, number];
        };
    }[] | undefined>;
    shouldRefreshAccessToken(aboutToExpireInNextSeconds?: number): Promise<boolean>;
    setGroupState(id: string | number, state: LightStateV1 | {
        scene: string;
    }): Promise<{
        success: boolean;
        data: any;
    }>;
    getGroupsV2(): Promise<{
        success: boolean;
        data: GroupedLightV2[];
        errors?: undefined;
    } | {
        success: boolean;
        errors: HueError[];
        data?: undefined;
    }>;
    getScenesV2(): Promise<{
        success: boolean;
        data: Scene[];
        errors?: undefined;
    } | {
        success: boolean;
        errors: HueError[];
        data?: undefined;
    }>;
    getSceneDetailsV2(id: string | number): Promise<{
        success: boolean;
        data: Scene;
        errors?: undefined;
    } | {
        success: boolean;
        errors: HueError[];
        data?: undefined;
    }>;
    getSmartScenesV2(): Promise<{
        success: boolean;
        data: Smart_scene[];
        errors?: undefined;
    } | {
        success: boolean;
        errors: HueError[];
        data?: undefined;
    }>;
    activateSceneV2(id: string): Promise<{
        success: boolean;
        data: {
            rid: string;
            rtype: string;
        }[];
        errors?: undefined;
    } | {
        success: boolean;
        errors: HueError[];
        data?: undefined;
    }>;
    activateSmartSceneV2(id: string): Promise<{
        success: boolean;
        data: {
            rid: string;
            rtype: string;
        }[];
        errors?: undefined;
    } | {
        success: boolean;
        errors: HueError[];
        data?: undefined;
    }>;
}
