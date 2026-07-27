export const ZENDI_VERSION = '14.0.0-alpha.1';

export type {
  Place,
  Region,
  PlaceType,
  MealType,
  PlaceDetails,
} from './types/place';

export type { RegionMeta } from './data/regions';
export { regions, regionMeta, REGION_ORDER, isRegion } from './data/regions';

export {
  allPlaces,
  placesByRegion,
  sokchoPlaces,
  gangneungPlaces,
  yangyangPlaces,
  yangpyeongPlaces,
  gyeongjuPlaces,
  busanPlaces,
  yeojuPlaces,
  gapyeongPlaces,
  pajuPlaces,
  jeonjuPlaces,
  ilsanPlaces,
  namyangjuPlaces,
  yeosuPlaces,
  gimpoPlaces,
} from './data/places';
