// ============================================
// TRIBUNAS QUARKS — Leitura por Edicao
// Visualizador PDF via Google Drive embed
// ============================================

import Link from 'next/link';
import { notFound } from 'next/navigation';

const driveLinks = {
  1:  '18LZLFbA6pnHCZj9m8Ds4sc1ubAHdMedK',
  2:  '1TKgvZ_239l9QkEkYFOGXhySL04_e9nUA',
  3:  '1phmRbVR81tRzcMZYI3_EfJVoVvwYsOqr',
  4:  '1z8Aqf540_LbwrS96eL7RrSwoDH4Wu3Au',
  5:  '1lADB2bLgJcZ2GJKz41jJorvIDplZkDHq',
  6:  '1TJ_xuc90_GlvsbJNzo3cnwzsIWyzLHUq',
  7:  '1-2AU3_SFKXDWcJRaeHllfCAXVT39BznL',
  8:  '1lEHUT-S0E7VdM6gP2Ai_ya2f7CqmA3vH',
  9:  '1lEHUT-S0E7VdM6gP2Ai_ya2f7CqmA3vH',
  10: '1ZSXQhVxwYbk6EOXKYY3xGFE41EInBKNm',
  11: '1_8CfttWcnX87JfPgv0rdjjAdx_GFNNzw',
  12: '1yKSfAOuOv6DJvBcdZYWXqzraGrj-rwUh',
  13: '18e1cOjZjb3S0XDsQp22PNmJDXJKB31Bd',
  14: '1Z0TJHLjGglAmMUW6nSFXEsQhbjcLQJVW',
  15: '1vRLD39DnTEpGSmeVpAbMbQTlP3hdiTtx',
  16: '1nT0pSo2dRI0WCgdoQAReprpYnH874r5n',
  17: '1cPoGe33czQRvqRpSpI6n0SFB0lh7RQ07',
  18: '11QZgaaoZy6KPJGb6nrfrVCBTS-OTyGG0',
  19: '19YIxs_gfppZnMi9BMy4gA1zL6L3DagjD',
  20: '15wh-aZYblN8Pdjvh47fgkO7I3X1dgDM4',
  21: '18MMkbKPoN4WUfI_e-KTQfbQ6CovD0dmO',
  22: '1leACNoY4rdgSQrEPJoXdtjnDCOlZm8Pb',
  23: '1tx-89BCuPkjheY4l1dhWYUVC_yleg0He',
  24: '1kilLLQx6jtLLMnMQx7gjzdOsf5F7S0Ua',
  25: '1cPTBiTOAMdgqShxjl-bgSAA9ubxa9nLY',
  26: '1uWNkn0RZE8aLPsOYcO0op8zwVc6s8hJE',
  27: '1Bfe4UreRHKDLlz8XicH4gS6Q2AX34aAj',
  28: '1M-jIAAiqv9tJWTziTgPwgIve6suyevJg',
  29: '1Iy3eSvKlf9kR5qCobZvxqHQqxyIitllF',
  30: '1zfpWei16VCabhTFUBCai2u-DHGPea5OU',
  31: '1H52Tq1w-BAgvgsA-cNyRkWEv_xQz7p52',
  32: '1xBMBc-SL1nwCtKkdUItlTif8wL-RdPJm',
  33: '1dkbPE4QdwtfF8KH0J453i-nRtBsM-9zz',
  34: '1ij6DFSbCGHt5igKkxonKS0IH_UQNz38Z',
  35: '1zSIFF6FkpKddm7dszZwNr9rvHhqB2bYE',
  36: '1gnu55aZGY74lOZxb4wICj7tOWrN8Eyv7',
  37: '1UHAHeKzi0c2GcRkAUcDKsiXIC-R1l3gW',
  38: '1BZmix3I-9dh5AOWUdJr0pAJ3gZlAriKG',
  39: '1XNDUPUvwMs2OYvGEqrg2Q-1STgJO2h2H',
  40: '1wHNSQOC7XHtRRwtSM9oGu5_By5BKHXP3',
  41: '1KEdbKnwjEa-oHjuJMxx9K7exzpUjGtQd',
  42: '1cx0g7y-C1pM9nIiUmly9lSrptwlCd6Fd',
};

export async function generateStaticParams() {
  return Object.keys(driveLinks).map((numero) => ({ numero }));
}

export async function generateMetadata({ params }) {
  const { numero } = await params;
  const num = String(numero).padStart(2, '0');
  return {
    title: `Tribuna Quark N.${num} — USS Venture`,
    description: `Leia a Tribuna Quark N.${num}, do acervo historico da Frota Venture.`,
  };
}

export default async function TribunaLeituraPage({ params }) {
  const { numero } = await params;
  const num = parseInt(numero, 10);

  if (!driveLinks[num]) {
    notFound();
  }

  const fileId = driveLinks[num];
  const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  const numStr = String(num).padStart(2, '0');

  const prev = num > 1 ? num - 1 : null;
  const next = num < 42 ? num + 1 : null;

  return (
    <div>
      <div className="lcars-hero">
        <h1>Tribuna Quark N.{numStr}</h1>
        <div className="subtitle">Acervo Historico — Frota Venture</div>
      </div>

      <div className="lcars-bar gradient" />

      <div className="lcars-panel" style={{ borderColor: 'var(--lcars-sky)' }}>
        <div className="lcars-panel-header" style={{ background: 'var(--lcars-sky)', color: '#000' }}>
          Leitura — Tribuna Quark N.{numStr}
        </div>
        <div className="lcars-panel-body" style={{ padding: '20px' }}>
          <iframe
            src={embedUrl}
            width="100%"
            height="800"
            style={{ border: 'none', borderRadius: '8px' }}
            allow="autoplay"
            title={`Tribuna Quark N.${numStr}`}
          />
        </div>
      </div>

      <div className="tribuna-nav-bar">
        <div>
          {prev && (
            <Link href={`/historico/tribunas-quarks/${prev}`} className="lcars-btn sky"
              style={{ fontSize: '0.8rem', padding: '8px 24px' }}>
              ← N.{String(prev).padStart(2, '0')}
            </Link>
          )}
        </div>
        <div>
          <Link href="/historico/tribunas-quarks" className="lcars-btn lavender"
            style={{ fontSize: '0.8rem', padding: '8px 24px' }}>
            Galeria
          </Link>
        </div>
        <div>
          {next && (
            <Link href={`/historico/tribunas-quarks/${next}`} className="lcars-btn sky"
              style={{ fontSize: '0.8rem', padding: '8px 24px' }}>
              N.{String(next).padStart(2, '0')} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
