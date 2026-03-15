// ============================================
// ROOT LAYOUT — Nucleo do sistema LCARS
// Protocolos de inicializacao do computador central
// ============================================

import './lcars.css';
import LCARSLayout from '@/components/LCARSLayout';
import { AuthProvider } from '@/components/AuthContext';

export const metadata = {
  title: 'Frota Venture SL',
  description: 'Sistema LCARS da Frota Venture — Grupo brasileiro de roleplay Star Trek no Second Life.',
  manifest: '/manifest.json',
  themeColor: '#FF9900',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Venture',
  },
  icons: {
    icon: '/icons/icon-512x512.png',
    apple: '/icons/icon-192x192.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <AuthProvider>
          <LCARSLayout>
            {children}
          </LCARSLayout>
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
