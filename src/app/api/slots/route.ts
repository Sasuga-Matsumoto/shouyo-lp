/**
 * /api/slots
 * GAS の slots_cached をプロキシして Vercel Edge Cache に乗せる。
 *
 * キャッシュ戦略:
 * - s-maxage=300（fresh: 5分）/ stale-while-revalidate=1800（30分まで stale で配信）
 * - GAS から 30分毎に warmVercelCache が叩いてキャッシュを保温
 *   → ユーザー視点では常に Edge Cache から 10〜50ms で返却される
 * - 予約直後の即時パージは行わない（最大30分のラグは「速度優先・衝突は運用側で個別リスケ」方針）
 */

export const runtime = 'edge';
export const revalidate = 300;

const GAS_URL = process.env.NEXT_PUBLIC_CALENDAR_GAS_URL || '';

export async function GET() {
  if (!GAS_URL) {
    return Response.json(
      { error: 'gas_url_not_set', message: 'NEXT_PUBLIC_CALENDAR_GAS_URL is not configured' },
      { status: 500 },
    );
  }

  const t0 = Date.now();
  try {
    const upstream = await fetch(`${GAS_URL}?action=slots_cached`, {
      next: { revalidate: 300 },
    });
    if (!upstream.ok) {
      return Response.json(
        { error: 'upstream_error', status: upstream.status },
        { status: 502 },
      );
    }
    const data = await upstream.json();
    return Response.json(
      { ...data, proxyMs: Date.now() - t0 },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1800',
        },
      },
    );
  } catch (err) {
    return Response.json(
      { error: 'fetch_error', message: String(err) },
      { status: 502 },
    );
  }
}
