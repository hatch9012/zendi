import type { Region } from '@zendi/shared';
import { isRegion, REGION_ORDER } from '@zendi/shared';
import { Planner } from '../../components/Planner';

export const metadata = {
  title: '하루 코스 만들기 - Zendi',
  description: '지역·시간·동행을 고르면 하루 동선을 추천하고, 순서는 드래그로 바꿀 수 있어요.',
};

/** `?region=` 으로 진입 지역을 미리 선택. 없거나 잘못되면 첫 지역. */
export default function PlanPage({
  searchParams,
}: {
  searchParams: { region?: string };
}) {
  const initialRegion: Region =
    searchParams.region && isRegion(searchParams.region)
      ? searchParams.region
      : REGION_ORDER[0];

  return <Planner initialRegion={initialRegion} />;
}
