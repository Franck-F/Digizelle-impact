import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  // Ici, on pourrait enregistrer dans une base ou un fichier
  // Pour la démo, on log simplement
  console.log('Réponse sondage:', data);
  return NextResponse.json({ success: true });
}
