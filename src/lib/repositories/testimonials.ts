import sql from '@/lib/db';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  approved: boolean;
  created_at: string;
  updated_at: string;
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const rows = await sql`SELECT * FROM testimonials WHERE approved = true ORDER BY created_at DESC`;
  return rows as unknown as Testimonial[];
}

export async function getRecentTestimonials(limit = 10): Promise<Testimonial[]> {
  const rows = await sql`SELECT * FROM testimonials WHERE approved = true ORDER BY created_at DESC LIMIT ${limit}`;
  return rows as unknown as Testimonial[];
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  const [row] = await sql`SELECT * FROM testimonials WHERE id = ${id}`;
  return (row as unknown as Testimonial) || null;
}

export async function createTestimonial(data: { name: string; role: string; quote: string; rating: number; approved?: boolean }): Promise<Testimonial> {
  const [row] = await sql`
    INSERT INTO testimonials (name, role, quote, rating, approved)
    VALUES (${data.name}, ${data.role}, ${data.quote}, ${data.rating}, ${data.approved ?? false})
    RETURNING *
  `;
  return row as unknown as Testimonial;
}

export async function updateTestimonial(id: string, data: { name?: string; role?: string; quote?: string; rating?: number; approved?: boolean }): Promise<Testimonial | null> {
  const [row] = await sql`
    UPDATE testimonials SET
      name = COALESCE(${data.name}, name),
      role = COALESCE(${data.role}, role),
      quote = COALESCE(${data.quote}, quote),
      rating = COALESCE(${data.rating}, rating),
      approved = COALESCE(${data.approved}, approved),
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
  const [row] = await sql`SELECT COUNT(*)::int AS count FROM testimonials WHERE approved = true`;
  const { count } = row as unknown as { count: number };
  return count;
}

export async function getPendingTestimonials(): Promise<Testimonial[]> {
  const rows = await sql`SELECT * FROM testimonials WHERE approved = false ORDER BY created_at DESC`;
  return rows as unknown as Testimonial[];
}

export async function approveTestimonial(id: string): Promise<Testimonial | null> {
  const [row] = await sql`
    UPDATE testimonials SET approved = true, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return (row as unknown as Testimonial) || null;
}

export async function getPendingTestimonialsCount(): Promise<number> {
  const [row] = await sql`SELECT COUNT(*)::int AS count FROM testimonials WHERE approved = false`;
  const { count } = row as unknown as { count: number };
  return count;
}

export async function approveAllPendingTestimonials(): Promise<void> {
  await sql`UPDATE testimonials SET approved = true, updated_at = NOW() WHERE approved = false`;
}
