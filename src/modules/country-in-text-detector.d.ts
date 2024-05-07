enum DetectionType {
  CITY = "city",
  COUNTRY = "country",
}

declare module "country-in-text-detector" {
  export type Detection = {
    iso3166: string;
    name: string;
    countryName: string;
    type: DetectionType;
    matches: string[];
  };

  export function detect(text: string): Detection[];
  export default { detect, Detection, DetectionType };
}
