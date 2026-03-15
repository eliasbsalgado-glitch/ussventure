// Redirect old mission URLs to unified page
import { redirect } from 'next/navigation';

export default async function OldMissaoPage({ params }) {
  const { missaoId } = await params;
  redirect(`/historico/missoes/${missaoId}`);
}
