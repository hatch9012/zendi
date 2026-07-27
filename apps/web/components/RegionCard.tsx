import Link from 'next/link';
import type { RegionMeta } from '@zendi/shared';

export function RegionCard({ region, count }: { region: RegionMeta; count: number }) {
  return (
    <Link
      href={`/region/${region.code}`}
      className="group flex flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition active:scale-[0.97]"
    >
      <span className="text-3xl">{region.emoji}</span>
      <span className="mt-2 text-base font-bold text-gray-900">{region.name}</span>
      <span className="mt-0.5 truncate text-[11px] text-gray-400">{region.tagline}</span>
      <span className="mt-2 inline-flex w-fit items-center rounded-full bg-zendi-blue-50 px-2 py-0.5 text-xs font-semibold text-zendi-blue-700">
        {count}곳
      </span>
    </Link>
  );
}
