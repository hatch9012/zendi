import { NextResponse } from 'next/server';
import { recommendPlan, reschedulePlan } from '../lib/planner/recommend';
import { toHHMM, toMinutes } from '../lib/planner/time';
import type { PlanInput } from '../lib/planner/types';

function render(plan: ReturnType<typeof recommendPlan>) {
  return {
    stops: plan.stops.map((s) => ({
      arrive: toHHMM(s.arriveMin),
      depart: toHHMM(s.departMin),
      stay: s.place.stay,
      transfer: s.transferToNextMin,
      type: s.place.type,
      meal: s.place.mealType ?? null,
      name: s.place.name,
    })),
    totalStay: plan.totalStayMin,
    totalTransfer: plan.totalTransferMin,
    end: toHHMM(plan.endMin),
    leftover: plan.leftoverMin,
  };
}

export function GET() {
  const scenarios: { label: string; input: PlanInput }[] = [
    {
      label: '속초 / 09:00~19:00 / 자가용 / 보통 / 커플',
      input: {
        region: 'sokcho',
        departMin: toMinutes('09:00'),
        returnMin: toMinutes('19:00'),
        transport: 'car',
        range: 'normal',
        companions: ['couple'],
      },
    },
    {
      label: '강릉 / 10:00~17:00 / 대중교통 / 넓게 / 가족+반려동물',
      input: {
        region: 'gangneung',
        departMin: toMinutes('10:00'),
        returnMin: toMinutes('17:00'),
        transport: 'transit',
        range: 'wide',
        companions: ['family', 'pet'],
      },
    },
    {
      label: '경주 / 08:00~21:00 / 도보 / 좁게 / 친구',
      input: {
        region: 'gyeongju',
        departMin: toMinutes('08:00'),
        returnMin: toMinutes('21:00'),
        transport: 'walk',
        range: 'tight',
        companions: ['friends'],
      },
    },
    {
      label: '엣지: 13:00~14:00 (너무 짧음)',
      input: {
        region: 'busan',
        departMin: toMinutes('13:00'),
        returnMin: toMinutes('14:00'),
        transport: 'car',
        range: 'normal',
        companions: ['couple'],
      },
    },
  ];

  const results = scenarios.map(({ label, input }) => {
    const plan = recommendPlan(input);
    // 드래그 재정렬 일관성 검증: 순서를 뒤집어 reschedule 했을 때
    // 체류합/이동합은 동일해야 하고 시각은 새 순서로 재계산돼야 한다.
    const reversed = [...plan.stops].reverse().map((s) => s.place);
    const re = reschedulePlan(input, reversed);
    return {
      label,
      plan: render(plan),
      rescheduleCheck: {
        sameTotalStay: re.totalStayMin === plan.totalStayMin,
        sameTotalTransfer: re.totalTransferMin === plan.totalTransferMin,
        firstStopAfterReorder: re.stops[0]?.place.name ?? null,
        firstArrive: re.stops[0] ? toHHMM(re.stops[0].arriveMin) : null,
      },
      overflowOk: plan.leftoverMin >= 0,
    };
  });

  return NextResponse.json(results, { status: 200 });
}
