import sql from '@/lib/db';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  property_title: string | null;
  read: boolean;
  created_at: string;
}

export async function getAllInquiries(): Promise<Inquiry[]> {
  const rows = await sql`SELECT * FROM inquiries ORDER BY created_at DESC`;
  return rows as unknown as Inquiry[];
}

export async function createInquiry(data: {
  name: string;
  email?: string;
  phone?: string;
  message: string;
  property_title?: string;
}): Promise<Inquiry> {
  const [inquiry] = await sql`
    INSERT INTO inquiries (name, email, phone, message, property_title)
    VALUES (${data.name}, ${data.email || ''}, ${data.phone || null}, ${data.message}, ${data.property_title || null})
    RETURNING *
  `;
  return inquiry as unknown as Inquiry;
}

export async function markInquiryRead(id: string): Promise<void> {
  await sql`UPDATE inquiries SET read = true WHERE id = ${id}`;
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const result = await sql`DELETE FROM inquiries WHERE id = ${id} RETURNING id`;
  return result.length > 0;
}
