# Zendi 작업 로그 (WORK_LOG)

프로젝트 진행 상황 기록. 최신 항목이 위로 오도록 작성.

---

## Week 4 — 하루 코스 플랜 기능 (2026-06-16~17)

### ✅ 완료

- **플래너 로직** (`apps/web/app/lib/planner/`) — 좌표 데이터가 없어 거리계산 대신 고정 이동버퍼 모델 채택
  - `types.ts` — `PlanInput` · `ScheduledStop` · `DayPlan` 등 타입
  - `time.ts` — 분 ↔ `"HH:MM"` 변환, `formatDuration` 표시 유틸
  - `transfer.ts` — 교통수단(도보/대중교통/자동차) × 밀도(좁게/보통/넓게) → 이동버퍼·장소수 상한
  - `schedule.ts` — **순수함수**: 장소 순서 + 출발시각 → 도착/출발 시각 파생. 추천·드래그 재정렬이 동일 함수 사용해 시간 산출 항상 일관
  - `recommend.ts` — 규칙 기반 greedy 추천(`recommendPlan`) + 드래그 재정렬용 재계산(`reschedulePlan`). 점수 = 평점·인기·시간대 적합·동행 가산·점심/저녁 슬롯·타입 다양성. 반려견은 강한 필터

- **`/plan` 화면**
  - `app/plan/page.tsx` — `?region=` 쿼리로 진입 지역 프리셋(없으면 첫 지역)
  - `components/Planner.tsx` — 조건 입력폼(지역·시간·교통수단·이동범위·동행 복수선택) + 결과 화면(`PlanResult`: 체류/이동/여유 요약, 복귀 카드)

- **드래그 재정렬** (`components/PlanTimeline.tsx`)
  - 외부 의존성 없이 Pointer 이벤트로 구현 (마우스 + 터치 동작)
  - 그립 드래그 → 행 사이 삽입선 표시 → 놓으면 `onReorder` → `reschedulePlan`으로 시각 자동 재계산

- **진입 동선 연결**: 홈 → 지역 카드 → `/region/[id]` → "🗺️ 하루 코스 만들기" 버튼 → `/plan?region=`

- **검증**: `apps/web` 타입체크 통과 (`npx tsc --noEmit`, exit 0)

### ⏳ 다음 작업 → v13 UX 재현으로 전환

- **Week 4 폼 방식 플래너 완성** (이 커밋이 되돌릴 스냅샷)
- **방향 전환 결정 (2026-07-27)**: 현재 v14 화면(홈=지역그리드 / `/region/[id]`=장소리스트 / `/plan`=폼 방식 플래너)이 v13.6 원본 UX와 많이 다름. 사용자 우선순위 = **디자인+플로우를 v13.6과 100% 동일**하게 재현(내부 코드는 v14 Next.js 구조 자유). 아래 결정 확정:
  - **단일 화면 재현**: v13처럼 URL 라우팅 없이 홈(`/`) 하나의 클라이언트 앱 + 팝업/모달로 통합. 기존 `/region/[id]`·`/plan` 라우트와 폼 방식 플래너(`app/lib/planner/*`)는 v13 팝업/필터 엔진으로 **대체 예정**.
  - **카카오 연동은 나중으로**: 🔑 버튼 자리만 두고 "준비중" 처리. 정적 341곳으로 전 기능 완성.
  - 341곳 데이터는 v13 모든 필드(moods·activities·goodFor·bestTime·mealType·cuisine·petFriendly·kidsZone·details) 보존 확인 → v13 추천 엔진 손실 없이 이식 가능.
- **로드맵**: Phase 0 폰 목업 프레임+토큰+상태 골격 → 1 추천 피드/엔진 → 2 지역 팝업 → 3 시간 팝업 → 4 스타일 팝업 → 5 커스텀 모드 → 6 하단 선택 바 → 7 플랜 모달 → 8 플랜 드래그+인라인편집 → 9 조정 팝업 → 10 대조 폴리시. Phase마다 커밋·브라우저 확인.

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
