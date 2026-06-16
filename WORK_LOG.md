# Zendi 작업 로그 (WORK_LOG)

프로젝트 진행 상황 기록. 최신 항목이 위로 오도록 작성.

---

## Week 2 — 모노레포 전환 & 데이터 마이그레이션 (2026-06-16)

### ✅ 완료

- **모노레포 전환**
  - pnpm workspace + Turborepo 구성 (`pnpm-workspace.yaml`, `turbo.json`, 루트 `package.json`)
  - 워크스페이스 구조: `apps/web`, `packages/shared`, `packages/ui`
  - Vercel 배포 설정 추가 (`vercel.json`)

- **Next.js 셋업** (`apps/web`)
  - Next.js 14.2.18 (App Router) + React 18.3.1 + TypeScript 5.5.4
  - Tailwind CSS + PostCSS 구성 (`tailwind.config.js`, `postcss.config.js`)
  - 기본 진입점: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

- **341곳 데이터 마이그레이션 완료** (`packages/shared/src/data/places/`)
  - 기존 v13.6 `index.html`의 `placesDB`를 14개 지역별 TS 모듈로 분리
  - `types/place.ts`에 `Place` / `Region` 등 타입 정의
  - `index.ts`에서 `allPlaces`(341곳 병합) · `placesByRegion`(지역 매핑) export
  - 지역별 장소 수: 속초 38 · 강릉 37 · 양양 36 · 경주 35 · 양평 35 · 부산 23 · 여주 22 · 가평 19 · 파주 18 · 전주 17 · 일산 17 · 남양주 16 · 여수 15 · 김포 13 = **341곳**

- **데이터 검증 통과** (`scripts/validate-places.ts`)
  - 중복 id: 0건 (고유 id 341 = 장소 수 341)
  - 필수 필드(name·region·emoji·img·desc·stay·price·rating·visitors 등) 누락: 0건
  - region 정합성(파일↔필드): 불일치 0건
  - `activities` 빈 배열 90건은 전부 `meal`(맛집) 타입 → 의도된 설계(맛집은 `mealType`/`cuisine` 사용), 오류 아님 → 검증 규칙에 예외 반영
  - 재실행: `npx tsx scripts/validate-places.ts` (이상 없으면 exit 0)

### ⏳ 미정 / 다음 작업

- **좌표(위도·경도) 필드 — 보류**: `Place` 타입에 좌표 필드 미정의. 지도 기능 도입 시 타입 + 341곳 데이터 추가 필요. (사용자 요청으로 나중에 진행)
