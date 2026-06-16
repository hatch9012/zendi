import type { Place, Region } from '../../types/place';
import { sokchoPlaces } from './sokcho';
import { yangyangPlaces } from './yangyang';
import { yangpyeongPlaces } from './yangpyeong';
import { yeojuPlaces } from './yeoju';
import { gangneungPlaces } from './gangneung';
import { gyeongjuPlaces } from './gyeongju';
import { jeonjuPlaces } from './jeonju';
import { yeosuPlaces } from './yeosu';
import { busanPlaces } from './busan';
import { gapyeongPlaces } from './gapyeong';
import { namyangjuPlaces } from './namyangju';
import { pajuPlaces } from './paju';
import { gimpoPlaces } from './gimpo';
import { ilsanPlaces } from './ilsan';

export { sokchoPlaces } from './sokcho';
export { yangyangPlaces } from './yangyang';
export { yangpyeongPlaces } from './yangpyeong';
export { yeojuPlaces } from './yeoju';
export { gangneungPlaces } from './gangneung';
export { gyeongjuPlaces } from './gyeongju';
export { jeonjuPlaces } from './jeonju';
export { yeosuPlaces } from './yeosu';
export { busanPlaces } from './busan';
export { gapyeongPlaces } from './gapyeong';
export { namyangjuPlaces } from './namyangju';
export { pajuPlaces } from './paju';
export { gimpoPlaces } from './gimpo';
export { ilsanPlaces } from './ilsan';

/** 14개 지역 전체 장소 (341곳) */
export const allPlaces: Place[] = [
  ...sokchoPlaces,
  ...yangyangPlaces,
  ...yangpyeongPlaces,
  ...yeojuPlaces,
  ...gangneungPlaces,
  ...gyeongjuPlaces,
  ...jeonjuPlaces,
  ...yeosuPlaces,
  ...busanPlaces,
  ...gapyeongPlaces,
  ...namyangjuPlaces,
  ...pajuPlaces,
  ...gimpoPlaces,
  ...ilsanPlaces,
];

/** 지역 코드 → 장소 배열 매핑 */
export const placesByRegion: Record<Region, Place[]> = {
  sokcho: sokchoPlaces,
  yangyang: yangyangPlaces,
  yangpyeong: yangpyeongPlaces,
  yeoju: yeojuPlaces,
  gangneung: gangneungPlaces,
  gyeongju: gyeongjuPlaces,
  jeonju: jeonjuPlaces,
  yeosu: yeosuPlaces,
  busan: busanPlaces,
  gapyeong: gapyeongPlaces,
  namyangju: namyangjuPlaces,
  paju: pajuPlaces,
  gimpo: gimpoPlaces,
  ilsan: ilsanPlaces,
};
