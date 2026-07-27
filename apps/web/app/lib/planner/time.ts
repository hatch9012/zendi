/** 00:00 기준 분 ↔ "HH:MM" 변환 및 표시 유틸. */

/** "09:30" → 570. 잘못된 형식이면 NaN. */
export function toMinutes(hhmm: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return NaN;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return NaN;
  return h * 60 + min;
}

/** 570 → "09:30". 24시 이상은 그대로 두 자리 시각으로 표기. */
export function toHHMM(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** 분 → 해당 시각의 '시'. 570 → 9 */
export function hourOf(min: number): number {
  return Math.floor(min / 60);
}

/** 90 → "1시간 30분", 60 → "1시간", 45 → "45분" */
export function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}
