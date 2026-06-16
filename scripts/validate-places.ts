/* 장소 데이터 무결성 검사: 중복 id / 필수 필드 누락·타입 / region 정합성 */
import { allPlaces, placesByRegion } from '../packages/shared/src/data/places/index';
import type { Place, Region } from '../packages/shared/src/types/place';

type Issue = { id: string; region: string; problem: string };
const issues: Issue[] = [];

// 1) 중복 id 검사
const seen = new Map<string, number>();
for (const p of allPlaces) seen.set(p.id, (seen.get(p.id) ?? 0) + 1);
const dups = [...seen.entries()].filter(([, n]) => n > 1);

// 2) 필수 필드 검사 (Place 타입의 non-optional 필드)
const requiredStr = ['id', 'name', 'region', 'type', 'emoji', 'img', 'freshness', 'trend', 'desc'] as const;
const requiredArr = ['moods', 'activities', 'goodFor', 'bestTime'] as const;
const requiredNum = ['stay', 'price', 'rating', 'visitors'] as const;

for (const [region, list] of Object.entries(placesByRegion) as [Region, Place[]][]) {
  for (const p of list) {
    const tag = (problem: string) => issues.push({ id: p.id ?? '(no-id)', region, problem });

    for (const f of requiredStr) {
      const v = (p as any)[f];
      if (v === undefined || v === null || (typeof v === 'string' && v.trim() === '')) tag(`필수 문자열 '${f}' 누락/빈값`);
      else if (typeof v !== 'string') tag(`'${f}' 타입 오류(문자열 아님): ${typeof v}`);
    }
    for (const f of requiredArr) {
      const v = (p as any)[f];
      if (!Array.isArray(v)) tag(`필수 배열 '${f}' 누락/비배열`);
      // meal(맛집) 타입은 활동 태그 대신 mealType/cuisine 을 쓰므로 빈 activities 허용
      else if (v.length === 0 && !(f === 'activities' && p.type === 'meal')) tag(`배열 '${f}' 비어있음`);
    }
    for (const f of requiredNum) {
      const v = (p as any)[f];
      if (typeof v !== 'number' || Number.isNaN(v)) tag(`필수 숫자 '${f}' 누락/숫자아님`);
    }
    if (p.details === undefined || typeof p.details !== 'object' || p.details === null) tag(`'details' 객체 누락`);

    // 3) region 정합성: 파일 키와 place.region 일치 여부
    if (p.region !== region) tag(`region 불일치: 필드='${p.region}' / 파일='${region}'`);

    // 값 범위 sanity
    if (typeof p.rating === 'number' && (p.rating < 0 || p.rating > 5)) tag(`rating 범위 이상: ${p.rating}`);
    if (typeof p.stay === 'number' && p.stay <= 0) tag(`stay 값 이상: ${p.stay}`);
  }
}

// 결과 출력
console.log(`총 장소 수: ${allPlaces.length}`);
console.log(`고유 id 수: ${seen.size}`);
console.log('');
console.log(`=== 1) 중복 id: ${dups.length}건 ===`);
if (dups.length) for (const [id, n] of dups) console.log(`  - ${id} (${n}회)`);
else console.log('  없음 ✅');
console.log('');
console.log(`=== 2)·3) 필드/정합성 문제: ${issues.length}건 ===`);
if (issues.length) for (const i of issues) console.log(`  - [${i.region}] ${i.id}: ${i.problem}`);
else console.log('  없음 ✅');

process.exit(dups.length || issues.length ? 1 : 0);
