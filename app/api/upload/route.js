// API: /api/upload — Upload de imagem de tripulante
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
  }

  // Sanitize filename
  const originalName = file.name;
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const filename = `${baseName}-${Date.now()}${ext}`;

  const uploadDir = path.join(process.cwd(), 'public', 'img', 'tripulantes');

  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, filename);
  const bytes = await file.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(bytes));

  const publicUrl = `/img/tripulantes/${filename}`;

  return NextResponse.json({ url: publicUrl, filename });
}
