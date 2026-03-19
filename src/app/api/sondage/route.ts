import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'sondage-results.json');

export async function POST(req: NextRequest) {
  try {
    const { nom, note, commentaire } = await req.json();
    if (!note) {
      return NextResponse.json({ error: 'Note requise' }, { status: 400 });
    }
    const entry = {
      nom: nom || '',
      note: Number(note),
      commentaire: commentaire || '',
      date: new Date().toISOString(),
    };
    let data = [];
    try {
      const file = await fs.readFile(DATA_FILE, 'utf-8');
      data = JSON.parse(file);
    } catch (e) {
      // ignore if file does not exist
    }
    data.push(entry);
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
