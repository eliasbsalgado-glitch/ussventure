// API: /api/upload — Upload de imagem de tripulante via Vercel Blob
import { NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');
  const oldUrl = formData.get('oldUrl'); // URL antiga para deletar

  if (!file) {
    return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
  }

  // Sanitize filename
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const baseName = file.name
    .split('.').slice(0, -1).join('.')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const filename = `tripulantes/${baseName}-${Date.now()}.${ext}`;

  try {
    // Deletar imagem anterior se existir (só blobs do Vercel)
    if (oldUrl && oldUrl.includes('vercel-storage.com')) {
      try { await del(oldUrl); } catch { /* ignora se falhar */ }
    }

    // Upload para Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type || 'image/jpeg',
    });

    return NextResponse.json({ url: blob.url, filename });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Erro no upload: ' + err.message }, { status: 500 });
  }
}
