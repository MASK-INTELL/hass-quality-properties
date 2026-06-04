import sql from '@/lib/db';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const rows = await sql`SELECT * FROM testimonials ORDER BY created_at DESC`;
  return rows as unknown as Testimonial[];
}

export async function getRecentTestimonials(limit = 10): Promise<Testimonial[]> {
  const rows = await sql`SELECT * FROM testimonials ORDER BY created_at DESC LIMIT ${limit}`;
  return rows as unknown as Testimonial[];
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  const [row] = await sql`SELECT * FROM testimonials WHERE id = ${id}`;
  return (row as unknown as Testimonial) || null;
}

export async function createTestimonial(data: { name: string; role: string; quote: string; rating: number }): Promise<Testimonial> {
  const [row] = await sql`
    INSERT INTO testimonials (name, role, quote, rating)
    VALUES (${data.name}, ${data.role}, ${data.quote}, ${data.rating})
    RETURNING *
  `;
  return row as unknown as Testimonial;
}

export async function updateTestimonial(id: string, data: { name?: string; role?: string; quote?: string; rating?: number }): Promise<Testimonial | null> {
  const [row] = await sql`
    UPDATE testimonials SET
      name = COALESCE(${data.name}, name),
      role = COALESCE(${data.role}, role),
      quote = COALESCE(${data.quote}, quote),
      rating = COALESCE(${data.rating}, rating),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return (row as unknown as Testimonial) || null;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const result = await sql`DELETE FROM testimonials WHERE id = ${id} RETURNING id`;
  return result.length > 0;
}

export async function getTestimonialCount(): Promise<number> {
  const [row] = await sql`SELECT COUNT(*)::int AS count FROM testimonials`;
  const { count } = row as unknown as { count: number };
  return count;
}
