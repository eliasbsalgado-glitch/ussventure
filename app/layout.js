// ============================================
// ROOT LAYOUT — Nucleo do sistema LCARS
// Protocolos de inicializacao do computador central
// ============================================

import './lcars.css';
import LCARSLayout from '@/components/LCARSLayout';
import { AuthProvider } from '@/components/AuthContext';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

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
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <LCARSLayout>
            {children}
          </LCARSLayout>
        </AuthProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
