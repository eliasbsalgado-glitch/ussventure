'use client';

// ============================================
// LCARS LAYOUT — Classic Standard v24.2
// Estrutura fiel ao template classic-standard
// ============================================

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import NotificationButton from '@/components/NotificationButton';

const navItems = [
  { href: '/',              label: 'PONTE' },
  { href: '/tripulacao',    label: 'TRIPULAÇÃO' },
  { href: '/divisoes',      label: 'DIVISÕES' },
  { href: '/patentes',      label: 'PATENTES' },
  { href: '/naves',         label: 'NAVES' },
  { href: '/condecoracoes', label: 'HONRARIAS' },
  { href: '/academia',      label: 'ACADEMIA' },
  { href: '/historico',     label: 'HISTÓRICO' },
];

// Data cascade values (decorative numbers like the original template)
const dataCascadeColumns = [
  ['93','1853','24109','7','7024','322','4149','86','05'],
  ['21509','68417','80','2048','319825','46233','05','2014','30986'],
  ['585101','25403','31219','752','0604','21048','293612','534082','206'],
  ['2107853','12201972','24487255','30412','98','4024161','888','35045462','41520257'],
  ['33','56','04','69','41','15','25','65','21'],
  ['0223','688','28471','21366','8654','31','1984','272','21854'],
  ['633','51166','41699','6188','15033','21094','32881','26083','2143'],
  ['406822','81205','91007','38357','110','2041','312','57104','00708'],
  ['12073','688','21982','20254','55','38447','26921','285','30102'],
  ['21604','15421','25','3808','582031','62311','85799','87','6895'],
  ['72112','101088','604122','126523','86801','8447','210486','LV426','220655'],
  ['272448','29620','339048','31802','9859','672304','581131','338','70104'],
  ['16182','711632','102955','2061','5804','850233','833441','465','210047'],
  ['75222','98824','63','858552','696730','307124','58414','209','808044'],
  ['331025','62118','2700','395852','604206','26','309150','885','210411'],
  ['817660','121979','20019','462869','25002','308','52074','33','80544'],
  ['1070','020478','26419','372122','2623','79','90008','8049','251664'],
  ['900007','704044','982365','25819','385','656214','409','218563','527222'],
  ['80106','1314577','39001','7162893','12855','57','23966','4','6244009'],
  ['2352','308','928','2721','8890','402','540','795','23'],
];

const dcRowClasses = [
  'dc-row-1','dc-row-1','dc-row-2','dc-row-3','dc-row-3',
  'dc-row-4','dc-row-5','dc-row-6','dc-row-7'
];

export default function LCARSLayout({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      <section className="wrap-standard" id="column-3">
        {/* ===== TOP ROW ===== */}
        <div className="wrap">
          {/* LEFT FRAME TOP — Sidebar topo */}
          <div className="left-frame-top">
            <Link href="/" className="panel-1-button">
              {user?.logged ? user.login.toUpperCase() : 'LCARS'}
            </Link>
            <div className="panel-2">
              {user?.logged ? (
                <>{user.role === 'admin' ? 'CMD' : 'OFC'}<span className="hop"> EM SERVICO</span></>
              ) : (
                <>02<span className="hop">-262000</span></>
              )}
            </div>
          </div>

          {/* RIGHT FRAME TOP — Banner + Data Cascade + Nav */}
          <div className="right-frame-top">
            <div className="banner">LCARS &#149; 47988</div>
            <div className="data-cascade-button-group">
              <div className="data-cascade-wrapper" id="default">
                {dataCascadeColumns.map((col, ci) => (
                  <div className="data-column" key={ci}>
                    {col.map((val, ri) => (
                      <div className={dcRowClasses[ri]} key={ri}>{val}</div>
                    ))}
                  </div>
                ))}
              </div>
              <nav>
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="bar-panel first-bar-panel">
              <div className="bar-1"></div>
              <div className="bar-2"></div>
              <div className="bar-3"></div>
              <div className="bar-4"></div>
              <div className="bar-5"></div>
            </div>
          </div>
        </div>

        {/* ===== BOTTOM ROW ===== */}
        <div className="wrap" id="gap">
          {/* LEFT FRAME — Sidebar com panels */}
          <div className="left-frame">
            <div>
              <div className="panel-3">03<span className="hop">-111968</span></div>
              <div className="panel-4">04<span className="hop">-041969</span></div>
              <div className="panel-5">05<span className="hop">-1701D</span></div>
              <div className="panel-6">06<span className="hop">-071984</span></div>
              <div className="panel-7">07<span className="hop">-081940</span></div>
              <div className="panel-8">08<span className="hop">-47148</span></div>

              {/* Sidebar nav — botões de seção */}
              <div className="sidebar-nav">
                <NotificationButton />
                {user?.logged ? (
                  <>
                    {user.role === 'admin' && (
                      <Link href="/admin">ADMIN</Link>
                    )}
                    {user.cargos?.includes('capitao') && user.naveSlug && (
                      <Link href="/capitao">CAPITÃO</Link>
                    )}
                    {user.cargos?.includes('chefe_divisao') && user.divisaoSlug && (
                      <Link href="/chefe-divisao">CHEFE DIV.</Link>
                    )}
                    {user.fichaSlug && (
                      <Link href="/meu-diario">MEU DIÁRIO</Link>
                    )}
                    <button onClick={logout}>SAIR</button>
                  </>
                ) : (
                  <Link href="/login">ACESSAR</Link>
                )}
              </div>

              <div className="panel-9">09<span className="hop">-081966</span></div>
            </div>
            <div>
              <div className="panel-10">10<span className="hop">-31</span></div>
            </div>
          </div>

          {/* RIGHT FRAME — Content area */}
          <div className="right-frame">
            <div className="bar-panel">
              <div className="bar-6"></div>
              <div className="bar-7"></div>
              <div className="bar-8"></div>
              <div className="bar-9"></div>
              <div className="bar-10"></div>
            </div>
            <main>
              {children}
            </main>
            <footer>
              Todos direitos reservados &copy; 2026 Frota Venture <br />
              Desenvolvido por Comandante Eli Pazrel (sailespy2) <br />
              LCARS Inspired Website Template by <a href="https://www.thelcars.com">www.TheLCARS.com</a>.<br />
              Star Trek e LCARS são marcas registradas da CBS Studios Inc. Este site não é oficial, não tem fins lucrativos e não é afiliado à CBS ou Paramount Pictures.
            </footer>
          </div>
        </div>
      </section>
      <div className="headtrim"> </div>
      <div className="baseboard"> </div>
    </>
  );
}
