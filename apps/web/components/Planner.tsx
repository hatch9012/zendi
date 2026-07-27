'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Place, Region } from '@zendi/shared';
import { regions, regionMeta } from '@zendi/shared';
import type {
  CompanionType,
  DayPlan,
  PlanInput,
  RangeDensity,
  TransportMode,
} from '../app/lib/planner/types';
import { recommendPlan, reschedulePlan } from '../app/lib/planner/recommend';
import { toHHMM, toMinutes, formatDuration } from '../app/lib/planner/time';
import { PlanTimeline } from './PlanTimeline';

const TRANSPORTS: { value: TransportMode; label: string; emoji: string }[] = [
  { value: 'walk', label: '도보', emoji: '🚶' },
  { value: 'transit', label: '대중교통', emoji: '🚌' },
  { value: 'car', label: '자동차', emoji: '🚗' },
];

const RANGES: { value: RangeDensity; label: string; desc: string }[] = [
  { value: 'tight', label: '좁게', desc: '촘촘하게 많이' },
  { value: 'normal', label: '보통', desc: '적당한 밀도' },
  { value: 'wide', label: '넓게', desc: '여유있게 적게' },
];

const COMPANIONS: { value: CompanionType; label: string; emoji: string }[] = [
  { value: 'couple', label: '연인', emoji: '💑' },
  { value: 'friends', label: '친구', emoji: '👯' },
  { value: 'family', label: '가족', emoji: '👨‍👩‍👧' },
  { value: 'pet', label: '반려견', emoji: '🐶' },
];

export function Planner({ initialRegion }: { initialRegion: Region }) {
  const [region, setRegion] = useState<Region>(initialRegion);
  const [depart, setDepart] = useState('09:00');
  const [ret, setRet] = useState('19:00');
  const [transport, setTransport] = useState<TransportMode>('transit');
  const [range, setRange] = useState<RangeDensity>('normal');
  const [companions, setCompanions] = useState<CompanionType[]>(['couple']);

  const [plan, setPlan] = useState<DayPlan | null>(null);

  const departMin = toMinutes(depart);
  const returnMin = toMinutes(ret);
  const timeValid =
    Number.isFinite(departMin) && Number.isFinite(returnMin) && returnMin - departMin >= 60;

  function toggleCompanion(c: CompanionType) {
    setCompanions((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  }

  function generate() {
    if (!timeValid) return;
    const input: PlanInput = {
      region,
      departMin,
      returnMin,
      transport,
      range,
      companions,
    };
    setPlan(recommendPlan(input));
  }

  function handleReorder(places: Place[]) {
    setPlan((prev) => (prev ? reschedulePlan(prev.input, places) : prev));
  }

  if (plan) {
    return <PlanResult plan={plan} onReorder={handleReorder} onEdit={() => setPlan(null)} />;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto min-h-screen max-w-mobile bg-gray-50">
        <header className="bg-gradient-to-br from-zendi-blue-600 to-zendi-blue-800 px-5 pb-6 pt-10 text-white">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-zendi-blue-100">
            ← 홈
          </Link>
          <h1 className="mt-4 text-2xl font-bold">하루 코스 만들기</h1>
          <p className="mt-1 text-sm text-zendi-blue-100">
            조건을 고르면 동선을 추천하고, 순서는 드래그로 바꿀 수 있어요.
          </p>
        </header>

        <div className="space-y-6 px-5 py-6">
          {/* 지역 */}
          <Field label="지역">
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as Region)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900"
            >
              {regions.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.emoji} {r.name} · {r.tagline}
                </option>
              ))}
            </select>
          </Field>

          {/* 시간 */}
          <Field label="시간">
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={depart}
                onChange={(e) => setDepart(e.target.value)}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900"
              />
              <span className="text-gray-400">→</span>
              <input
                type="time"
                value={ret}
                onChange={(e) => setRet(e.target.value)}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900"
              />
            </div>
            {!timeValid && (
              <p className="mt-1.5 text-xs text-red-500">
                복귀 시각은 출발보다 최소 1시간 이후여야 해요.
              </p>
            )}
          </Field>

          {/* 교통수단 */}
          <Field label="교통수단">
            <SegmentedGroup>
              {TRANSPORTS.map((t) => (
                <Segment
                  key={t.value}
                  active={transport === t.value}
                  onClick={() => setTransport(t.value)}
                >
                  <span className="text-base">{t.emoji}</span>
                  {t.label}
                </Segment>
              ))}
            </SegmentedGroup>
          </Field>

          {/* 이동 범위 */}
          <Field label="이동 범위">
            <SegmentedGroup>
              {RANGES.map((r) => (
                <Segment key={r.value} active={range === r.value} onClick={() => setRange(r.value)}>
                  <span>{r.label}</span>
                  <span className="text-[10px] font-normal text-gray-400">{r.desc}</span>
                </Segment>
              ))}
            </SegmentedGroup>
          </Field>

          {/* 동행 */}
          <Field label="누구와 함께">
            <div className="flex flex-wrap gap-2">
              {COMPANIONS.map((c) => {
                const active = companions.includes(c.value);
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => toggleCompanion(c.value)}
                    className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
                      active
                        ? 'bg-zendi-blue-600 text-white'
                        : 'bg-white text-gray-600 ring-1 ring-gray-200'
                    }`}
                  >
                    {c.emoji} {c.label}
                  </button>
                );
              })}
            </div>
            {companions.includes('pet') && (
              <p className="mt-1.5 text-xs text-gray-400">
                반려견 동반 가능한 장소만 코스에 포함돼요.
              </p>
            )}
          </Field>

          <button
            type="button"
            onClick={generate}
            disabled={!timeValid}
            className="w-full rounded-2xl bg-zendi-blue-600 py-3.5 text-base font-bold text-white shadow-sm transition active:scale-[0.98] disabled:opacity-40"
          >
            코스 추천받기
          </button>
        </div>
      </div>
    </main>
  );
}

function PlanResult({
  plan,
  onReorder,
  onEdit,
}: {
  plan: DayPlan;
  onReorder: (places: Place[]) => void;
  onEdit: () => void;
}) {
  const meta = regionMeta[plan.input.region];
  const over = plan.leftoverMin < 0;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto min-h-screen max-w-mobile bg-gray-50">
        <header className="bg-gradient-to-br from-zendi-blue-600 to-zendi-blue-800 px-5 pb-6 pt-10 text-white">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1 text-sm text-zendi-blue-100"
          >
            ← 조건 수정
          </button>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-4xl">{meta.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold">{meta.name} 하루 코스</h1>
              <p className="text-sm text-zendi-blue-100">
                {toHHMM(plan.input.departMin)} 출발 · {plan.stops.length}곳
              </p>
            </div>
          </div>

          {/* 요약 */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Summary label="체류" value={formatDuration(plan.totalStayMin)} />
            <Summary label="이동" value={formatDuration(plan.totalTransferMin)} />
            <Summary
              label={over ? '초과' : '여유'}
              value={formatDuration(Math.abs(plan.leftoverMin))}
              warn={over}
            />
          </div>
        </header>

        <div className="px-5 py-6">
          {plan.stops.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center text-sm text-gray-500 ring-1 ring-gray-100">
              조건에 맞는 장소를 찾지 못했어요.
              <br />
              시간대나 동행 조건을 바꿔보세요.
            </div>
          ) : (
            <>
              <p className="mb-3 text-xs text-gray-400">
                그립(⠿)을 끌어 순서를 바꾸면 시간이 자동으로 다시 계산돼요.
              </p>
              <PlanTimeline stops={plan.stops} onReorder={onReorder} />

              {/* 복귀 */}
              <div className="mt-3 flex items-center gap-3 rounded-2xl bg-zendi-blue-50 p-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl">
                  🏁
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-900">일정 종료</p>
                  <p className="text-xs text-gray-500">{toHHMM(plan.endMin)} 출발 · 복귀</p>
                </div>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={onEdit}
            className="mt-6 w-full rounded-2xl bg-white py-3.5 text-base font-bold text-zendi-blue-700 ring-1 ring-zendi-blue-200 transition active:scale-[0.98]"
          >
            다시 만들기
          </button>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-2 text-sm font-semibold text-gray-500">{label}</h2>
      {children}
    </div>
  );
}

function SegmentedGroup({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-3 gap-2">{children}</div>;
}

function Segment({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2.5 text-sm font-medium transition ${
        active ? 'bg-zendi-blue-600 text-white' : 'bg-white text-gray-600 ring-1 ring-gray-200'
      }`}
    >
      {children}
    </button>
  );
}

function Summary({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className={`rounded-xl px-2 py-2 ${warn ? 'bg-red-500/20' : 'bg-white/10'}`}>
      <p className="text-[11px] text-zendi-blue-100">{label}</p>
      <p className="mt-0.5 text-sm font-bold">{value}</p>
    </div>
  );
}
