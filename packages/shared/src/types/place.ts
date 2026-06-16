/**
 * Zendi 여행지 데이터 타입 정의
 * v13.6 index.html 의 placesDB 구조를 그대로 옮긴 것 (341곳 / 14개 지역).
 */

/** 14개 지원 지역 코드 */
export type Region =
  | 'sokcho'
  | 'gangneung'
  | 'yangyang'
  | 'yangpyeong'
  | 'gyeongju'
  | 'busan'
  | 'yeoju'
  | 'gapyeong'
  | 'paju'
  | 'jeonju'
  | 'ilsan'
  | 'namyangju'
  | 'yeosu'
  | 'gimpo';

/** 장소 분류 */
export type PlaceType = 'nature' | 'culture' | 'meal' | 'cafe' | 'shopping';

/** 식사 시간대 (meal/cafe 류 일부에만 존재). 예: ['점심','저녁'] */
export type MealType = string[];

/** 키-값 형태의 부가 상세 정보 (이모지 키 사용). 예: { '📸 포토존': '3개' } */
export type PlaceDetails = Record<string, string>;

export interface Place {
  /** 고유 ID. 지역 약어 + 번호. 예: sc001, gn012 */
  id: string;
  /** 장소명 */
  name: string;
  /** 소속 지역 코드 */
  region: Region;
  /** 분류 */
  type: PlaceType;
  /** 대표 이모지 */
  emoji: string;
  /** 이미지 키 (UI에서 플레이스홀더 매핑용) */
  img: string;
  /** 분위기 태그. 예: ['감성','힐링'] */
  moods: string[];
  /** 활동 태그. 예: ['트래킹','포토존'] */
  activities: string[];
  /** 동행 적합도. 예: ['혼자','연인','가족','반려견'] */
  goodFor: string[];
  /** 권장 체류 시간 (분) */
  stay: number;
  /** 입장/이용 비용 (원, 0 = 무료) */
  price: number;
  /** 평점 (5점 만점) */
  rating: number;
  /** 방문자 수 (인기 지표) */
  visitors: number;
  /** 정보 신선도. 예: '2026-04' */
  freshness: string;
  /** 트렌드 문구. 예: '봄 벚꽃 ✨' */
  trend: string;
  /** 추천 방문 시간대 (시). 예: [9,11,16,18] */
  bestTime: number[];
  /** 설명 */
  desc: string;
  /** 부가 상세 정보 */
  details: PlaceDetails;

  /** 식사 시간대 (선택). 예: ['점심','저녁'] */
  mealType?: MealType;
  /** 요리/음식 종류 (선택). 예: ['한식'] */
  cuisine?: string[];
  /** 반려견 동반 가능 (선택) */
  petFriendly?: boolean;
  /** 키즈존 (선택) */
  kidsZone?: boolean;
  /** 노키즈존 (선택) */
  noKidsZone?: boolean;
}
