declare module 'geoip-lite' {
  export interface GeoIP {
    country: string;
    region: string;
    city: string;
    ll?: [number, number];
    metro?: number;
    range?: [number, number];
    timezone?: string;
  }

  interface GeoIPLookup {
    lookup(ip: string): GeoIP | null;
    prettyPrint(ip: string): string;
    startWatchingDataUpdate(callback?: () => void): void;
    stopWatchingDataUpdate(): void;
    clear(): void;
    reloadData(sync?: boolean): void;
    updateDate(): Date;
    ranges: any;
    data: any;
  }

  const geoip: GeoIPLookup;
  export default geoip;
}

