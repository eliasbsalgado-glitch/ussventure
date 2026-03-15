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
      </body>
    </html>
  );
}
