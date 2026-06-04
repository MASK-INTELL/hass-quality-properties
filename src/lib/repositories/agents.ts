import sql from '@/lib/db';

export interface Agent {
  id: string;
  name: string;
  title: string;
  photo_url: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export async function getAllAgents(): Promise<Agent[]> {
  const rows = await sql`SELECT * FROM agents ORDER BY sort_order ASC, created_at ASC`;
  return rows as unknown as Agent[];
}

export async function getAgentById(id: string): Promise<Agent | null> {
  const [row] = await sql`SELECT * FROM agents WHERE id = ${id}`;
  return (row as unknown as Agent) || null;
}

export async function createAgent(data: Partial<Agent>): Promise<Agent> {
  const [row] = await sql`
    INSERT INTO agents (name, title, photo_url, sort_order)
    VALUES (${data.name}, ${data.title}, ${data.photo_url}, ${data.sort_order ?? 0})
    RETURNING *
  `;
  return row as unknown as Agent;
}

export async function updateAgent(id: string, data: Partial<Agent>): Promise<Agent | null> {
  const [row] = await sql`
    UPDATE agents SET
      name = COALESCE(${data.name}, name),
      title = COALESCE(${data.title}, title),
      photo_url = COALESCE(${data.photo_url}, photo_url),
      sort_order = COALESCE(${data.sort_order}, sort_order),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return (row as unknown as Agent) || null;
}

export async function deleteAgent(id: string): Promise<boolean> {
  const result = await sql`DELETE FROM agents WHERE id = ${id} RETURNING id`;
  return result.length > 0;
}
