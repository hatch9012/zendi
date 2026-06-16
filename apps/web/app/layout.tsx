import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Zendi - 눈 뜨자마자 나의 하루가 시작된다',
  description: 'AI 기반 하루 여행 플래너',
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#185fa5' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="ko"><body>{children}</body></html>);
}
