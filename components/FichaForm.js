'use client';

// ============================================
// FICHA FORM — Formulario de ficha de servico
// Componente compartilhado: Nova + Editar
// Condecoracoes carregadas do banco (honrarias)
// ============================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PATENTES = ['Almirante', 'Comodoro', 'Capitao', 'Comandante', 'Tenente Comandante', 'Tenente', 'Tenente Junior', 'Alferes', 'Cadete', 'Tripulante Classe 2', 'Tripulante Classe 3', 'Recruta'];
const DIVISOES = ['Comando', 'Academia', 'Ciencias', 'Comunicacoes', 'Engenharia', 'Operacoes', 'Tatico', 'Civil', 'Reserva'];

const CATEGORIAS_LABEL = {
  'academia': 'Academia',
  'merito': 'Mérito',
  'tecnicas': 'Técnicas e Desenvolvimento',
  'tempo_servico': 'Tempo de Serviço',
  'outros': 'Outros',
};

const inputStyle = {
  width: '100%', padding: '10px 14px',
  background: 'rgba(0,0,0,0.4)', border: '1px solid #555',
  borderRadius: 'var(--lcars-radius-sm)', color: 'var(--lcars-peach)',
  fontFamily: 'var(--font-lcars)', fontSize: '0.9rem',
};

const labelStyle = {
  display: 'block', marginBottom: '4px',
  fontSize: '0.75rem', textTransform: 'uppercase',
  letterSpacing: '2px', color: 'var(--lcars-text-dim)',
};

export default function FichaForm({ initial, isEdit }) {
  const router = useRouter();
  const [form, setForm] = useState(initial || {
    nome: '', nascimentoSL: '', cidade: '', raca: '', admissao: '',
    patente: '', divisao: '', departamento: '', foto: '',
    historia: '', timeline: [], condecoracoes: [], cursos: [],
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Honrarias from database
  const [honrarias, setHonrarias] = useState([]);
  const [loadingHonrarias, setLoadingHonrarias] = useState(true);

  useEffect(() => {
    fetch('/api/honrarias')
      .then(r => r.json())
      .then(data => { setHonrarias(data); setLoadingHonrarias(false); })
      .catch(() => setLoadingHonrarias(false));
  }, []);

  function set(field, value) { setForm(prev => ({ ...prev, [field]: value })); }

  // Timeline
  function addTimeline() { set('timeline', [...form.timeline, { data: '', evento: '' }]); }
  function updateTimeline(i, field, val) {
    const t = [...form.timeline]; t[i] = { ...t[i], [field]: val }; set('timeline', t);
  }
  function removeTimeline(i) { set('timeline', form.timeline.filter((_, j) => j !== i)); }

  // Cursos
  function addCurso() { set('cursos', [...form.cursos, { nome: '', data: '' }]); }
  function updateCurso(i, field, val) {
    const c = [...form.cursos]; c[i] = { ...c[i], [field]: val }; set('cursos', c);
  }
  function removeCurso(i) { set('cursos', form.cursos.filter((_, j) => j !== i)); }

  // Condecoracoes toggle — now with auto-timeline
  function toggleMedal(honrariaId) {
    const has = form.condecoracoes.includes(honrariaId);
    if (has) {
      // Remove condecoracao
      set('condecoracoes', form.condecoracoes.filter(m => m !== honrariaId));
    } else {
      // Add condecoracao + auto-add timeline event
      const honraria = honrarias.find(h => h.id === honrariaId);
      const newCondecoracoes = [...form.condecoracoes, honrariaId];
      const hoje = new Date().toISOString().split('T')[0];
      const eventoTexto = `Recebeu Condecoração de ${honraria?.nome || honrariaId}`;

      // Check if timeline already has this exact event to avoid duplicates
      const alreadyExists = form.timeline.some(ev => ev.evento === eventoTexto);
      const newTimeline = alreadyExists ? form.timeline : [...form.timeline, { data: hoje, evento: eventoTexto }];

      setForm(prev => ({ ...prev, condecoracoes: newCondecoracoes, timeline: newTimeline }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const url = isEdit ? `/api/fichas/${initial.slug}` : '/api/fichas';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      router.push(isEdit ? `/tripulacao/${initial.slug}` : `/tripulacao/${data.slug}`);
    } else {
      alert('Erro ao salvar');
      setSaving(false);
    }
  }

  // Group honrarias by category
  const honrariasByCategoria = {};
  honrarias.forEach(h => {
    if (!honrariasByCategoria[h.categoria]) honrariasByCategoria[h.categoria] = [];
    honrariasByCategoria[h.categoria].push(h);
  });

  // Category order
  const catOrder = ['academia', 'merito', 'tecnicas', 'tempo_servico', 'outros'];
  const sortedCats = catOrder.filter(c => honrariasByCategoria[c]);

  return (
    <form onSubmit={handleSubmit}>
      {/* DADOS BASICOS */}
      <div className="lcars-panel">
        <div className="lcars-panel-header orange">Dados Pessoais</div>
        <div className="lcars-panel-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Nome Completo</label>
              <input style={inputStyle} value={form.nome} onChange={e => set('nome', e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>Nascimento SL</label>
              <input style={inputStyle} type="date" value={form.nascimentoSL} onChange={e => set('nascimentoSL', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Cidade / Origem</label>
              <input style={inputStyle} value={form.cidade} placeholder="Ex: Sao Paulo - Brasil - Terra" onChange={e => set('cidade', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Raca</label>
              <input style={inputStyle} value={form.raca} placeholder="Humano, Vulcano, etc." onChange={e => set('raca', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Data de Admissao</label>
              <input style={inputStyle} type="date" value={form.admissao} onChange={e => set('admissao', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Patente</label>
              <select style={inputStyle} value={form.patente} onChange={e => set('patente', e.target.value)}>
                <option value="">Selecionar...</option>
                {PATENTES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Divisao</label>
              <select style={inputStyle} value={form.divisao} onChange={e => set('divisao', e.target.value)}>
                <option value="">Selecionar...</option>
                {DIVISOES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Departamento</label>
              <input style={inputStyle} value={form.departamento} onChange={e => set('departamento', e.target.value)} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Foto de Perfil</label>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Preview */}
                <div style={{
                  width: '90px', height: '110px', borderRadius: 'var(--lcars-radius-sm)',
                  border: '1px solid #555', background: 'rgba(0,0,0,0.4)',
                  overflow: 'hidden', flexShrink: 0,
                }}>
                  {form.foto ? (
                    <img src={form.foto} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '0.6rem' }}>SEM FOTO</div>
                  )}
                </div>
                {/* Upload */}
                <div style={{ flex: 1 }}>
                  <input type="file" accept="image/*" disabled={uploading}
                    style={{ ...inputStyle, padding: '8px', cursor: 'pointer' }}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setUploading(true);
                      const fd = new FormData();
                      fd.append('file', file);
                      if (form.foto) fd.append('oldUrl', form.foto);
                      try {
                        const res = await fetch('/api/upload', { method: 'POST', body: fd });
                        const data = await res.json();
                        if (data.url) set('foto', data.url);
                        else alert(data.error || 'Erro no upload');
                      } catch { alert('Erro no upload da imagem'); }
                      setUploading(false);
                    }}
                  />
                  {uploading && <div style={{ color: 'var(--lcars-sky)', fontSize: '0.75rem', marginTop: '4px' }}>Enviando imagem...</div>}
                  {form.foto && <div style={{ color: 'var(--lcars-text-dim)', fontSize: '0.7rem', marginTop: '4px' }}>{form.foto}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HISTORIA */}
      <div className="lcars-panel">
        <div className="lcars-panel-header">Historia Pregressa</div>
        <div className="lcars-panel-body">
          <textarea style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
            value={form.historia} onChange={e => set('historia', e.target.value)}
            placeholder="Descreva a historia de vida e origem do tripulante..."
          />
        </div>
      </div>

      {/* TIMELINE */}
      <div className="lcars-panel">
        <div className="lcars-panel-header sky">Carreira — Linha do Tempo</div>
        <div className="lcars-panel-body">
          {form.timeline.map((ev, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
              <input style={{ ...inputStyle, width: '170px', flexShrink: 0 }} type="date"
                value={ev.data} onChange={e => updateTimeline(i, 'data', e.target.value)}
              />
              <input style={{ ...inputStyle, flex: 1 }} placeholder="Evento (promocao, admissao, condecoração...)"
                value={ev.evento} onChange={e => updateTimeline(i, 'evento', e.target.value)}
              />
              <button type="button" onClick={() => removeTimeline(i)}
                style={{ background: 'var(--lcars-red)', color: '#000', border: 'none', borderRadius: '4px', padding: '8px 12px', cursor: 'pointer', fontWeight: 700 }}>
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={addTimeline}
            className="lcars-btn sky" style={{ fontSize: '0.8rem', marginTop: '6px' }}>
            + Adicionar Evento
          </button>
        </div>
      </div>

      {/* CONDECORACOES — FROM DATABASE */}
      <div className="lcars-panel">
        <div className="lcars-panel-header lavender">
          Condecoracoes — {form.condecoracoes.length} atribuidas
        </div>
        <div className="lcars-panel-body">
          <p style={{ fontSize: '0.75rem', color: 'var(--lcars-text-dim)', marginBottom: '4px' }}>
            Clique nas medalhas para atribuir/remover.
            <span style={{ color: 'var(--lcars-teal)' }}> Ao atribuir, um evento sera adicionado automaticamente na linha do tempo.</span>
          </p>

          {loadingHonrarias ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--lcars-text-dim)' }}>Carregando honrarias...</div>
          ) : honrarias.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--lcars-text-dim)' }}>Nenhuma honraria cadastrada no banco.</div>
          ) : (
            sortedCats.map(cat => (
              <div key={cat} style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '0.7rem', color: 'var(--lcars-lavender)', textTransform: 'uppercase',
                  letterSpacing: '2px', marginBottom: '8px', paddingBottom: '4px',
                  borderBottom: '1px solid rgba(204,153,204,0.2)',
                }}>
                  {CATEGORIAS_LABEL[cat] || cat}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {honrariasByCategoria[cat].map(h => {
                    const selected = form.condecoracoes.includes(h.id);
                    return (
                      <div key={h.id} onClick={() => toggleMedal(h.id)} style={{
                        cursor: 'pointer', width: '72px', textAlign: 'center',
                        padding: '6px 4px', borderRadius: 'var(--lcars-radius-sm)',
                        background: selected ? 'rgba(204,153,204,0.2)' : 'rgba(0,0,0,0.3)',
                        border: selected ? '2px solid var(--lcars-lavender)' : '2px solid transparent',
                        transition: 'all 0.2s',
                      }}>
                        {h.imagem ? (
                          <img src={h.imagem} alt={h.nome}
                            style={{ width: '48px', height: '48px', objectFit: 'contain', opacity: selected ? 1 : 0.4 }}
                          />
                        ) : (
                          <div style={{
                            width: '48px', height: '48px', margin: '0 auto',
                            background: 'rgba(204,153,204,0.15)', borderRadius: '4px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.5rem', color: '#555', opacity: selected ? 1 : 0.4,
                          }}>SEM IMG</div>
                        )}
                        <div style={{
                          fontSize: '0.5rem', marginTop: '3px', lineHeight: '1.2',
                          color: selected ? 'var(--lcars-lavender)' : '#555',
                          overflow: 'hidden', textOverflow: 'ellipsis',
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        }}>
                          {h.nome}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CURSOS */}
      <div className="lcars-panel">
        <div className="lcars-panel-header teal">Cursos da Academia</div>
        <div className="lcars-panel-body">
          {form.cursos.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
              <input style={{ ...inputStyle, flex: 1 }} placeholder="Nome do curso"
                value={c.nome} onChange={e => updateCurso(i, 'nome', e.target.value)}
              />
              <input style={{ ...inputStyle, width: '170px', flexShrink: 0 }} type="date"
                value={c.data} onChange={e => updateCurso(i, 'data', e.target.value)}
              />
              <button type="button" onClick={() => removeCurso(i)}
                style={{ background: 'var(--lcars-red)', color: '#000', border: 'none', borderRadius: '4px', padding: '8px 12px', cursor: 'pointer', fontWeight: 700 }}>
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={addCurso}
            className="lcars-btn teal" style={{ fontSize: '0.8rem', marginTop: '6px' }}>
            + Adicionar Curso
          </button>
        </div>
      </div>

      {/* SUBMIT */}
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <button type="submit" disabled={saving}
          className="lcars-btn orange" style={{ fontSize: '1rem', padding: '14px 40px', cursor: saving ? 'wait' : 'pointer', border: 'none' }}>
          {saving ? 'Salvando...' : isEdit ? 'Atualizar Ficha' : 'Registrar Nova Ficha'}
        </button>
      </div>
    </form>
  );
}
