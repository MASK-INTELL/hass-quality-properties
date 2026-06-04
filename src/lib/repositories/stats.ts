import sql from '@/lib/db';

export interface Stat {
  id: string;
  label: string;
  value: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export async function getAllStats(): Promise<Stat[]> {
  const rows = await sql`SELECT * FROM stats ORDER BY sort_order ASC`;
  return rows as unknown as Stat[];
}

export async function createStat(data: { label: string; value: string; sort_order?: number }): Promise<Stat> {
  if (data.sort_order === undefined) {
    const [maxOrder] = await sql`SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM stats`;
    const { next_order } = maxOrder as unknown as { next_order: number };
    data.sort_order = next_order;
  }
  const [stat] = await sql`
    INSERT INTO stats (label, value, sort_order)
    VALUES (${data.label}, ${data.value}, ${data.sort_order})
    RETURNING *
  `;
  return stat as unknown as Stat;
}

export async function updateStat(id: string, data: { label?: string; value?: string; sort_order?: number }): Promise<Stat | null> {
  const [stat] = await sql`
    UPDATE stats SET
      label = COALESCE(${data.label}, label),
      value = COALESCE(${data.value}, value),
      sort_order = COALESCE(${data.sort_order}, sort_order),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return (stat as unknown as Stat) || null;
}

export async function deleteStat(id: string): Promise<boolean> {
  const result = await sql`DELETE FROM stats WHERE id = ${id} RETURNING id`;
  return result.length > 0;
}
