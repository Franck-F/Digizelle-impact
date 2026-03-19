import { promises as fs } from 'fs';
import path from 'path';

export async function getSondageResults() {
  const DATA_FILE = path.join(process.cwd(), 'sondage-results.json');
  try {
    const file = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(file);
  } catch (e) {
    return [];
  }
}
