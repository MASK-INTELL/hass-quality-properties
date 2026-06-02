import sql from '@/lib/db';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  category: string;
  type: string;
  status: string;
  image_url: string;
  beds: number | null;
  baths: number | null;
  area: string | null;
  images: string[] | null;
  make: string | null;
  model: string | null;
  year: number | null;
  mileage: string | null;
  transmission: string | null;
  fuel_type: string | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function getAllProperties(): Promise<Property[]> {
  const rows = await sql`SELECT * FROM properties ORDER BY created_at DESC`;
  return rows as Property[];
}

export async function getFeaturedProperties(limit = 3): Promise<Property[]> {
  const rows = await sql`SELECT * FROM properties ORDER BY created_at DESC LIMIT ${limit}`;
  return rows as Property[];
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const [property] = await sql`SELECT * FROM properties WHERE id = ${id}`;
  return (property as unknown as Property) || null;
}

export async function getSimilarProperties(
  category: string,
  excludeId: string,
  limit = 3
): Promise<Property[]> {
  const rows = await sql`
    SELECT * FROM properties 
    WHERE category = ${category} AND id != ${excludeId} 
    ORDER BY created_at DESC LIMIT ${limit}
  `;
  return rows as Property[];
}

export async function getPropertiesPaginated(
  page: number,
  pageSize: number,
  filters?: {
    search?: string;
    category?: string;
    status?: string;
  }
): Promise<{ data: Property[]; total: number }> {
  const offset = (page - 1) * pageSize;
  const conditions: string[] = [];
  const params: any[] = [];

  if (filters?.search) {
    conditions.push(`(title ILIKE $${params.length + 1} OR location ILIKE $${params.length + 1})`);
    params.push(`%${filters.search}%`);
  }
  if (filters?.category && filters.category !== 'All') {
    conditions.push(`category = $${params.length + 1}`);
    params.push(filters.category);
  }
  if (filters?.status && filters.status !== 'All') {
    conditions.push(`status = $${params.length + 1}`);
    params.push(filters.status);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countQuery = `SELECT COUNT(*) FROM properties ${where}`;
  const [{ count }] = await sql(countQuery, ...params);

  const dataQuery = `SELECT * FROM properties ${where} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  const data = await sql(dataQuery, ...params, pageSize, offset);

  return { data: data as unknown as Property[], total: Number(count) };
}

export async function createProperty(data: Partial<Property>): Promise<Property> {
  const [property] = await sql`
    INSERT INTO properties (
      title, description, price, location, category, type, status,
      image_url, images, video_url, beds, baths, area,
      make, model, year, mileage, transmission, fuel_type
    ) VALUES (
      ${data.title}, ${data.description}, ${data.price}, ${data.location},
      ${data.category}, ${data.type}, ${data.status},
      ${data.image_url}, ${data.images || null}, ${data.video_url || null},
      ${data.beds || null}, ${data.baths || null}, ${data.area || null},
      ${data.make || null}, ${data.model || null}, ${data.year || null},
      ${data.mileage || null}, ${data.transmission || null}, ${data.fuel_type || null}
    ) RETURNING *
  `;
  return property as unknown as Property;
}

export async function updateProperty(id: string, data: Partial<Property>): Promise<Property | null> {
  const [property] = await sql`
    UPDATE properties SET
      title = COALESCE(${data.title}, title),
      description = COALESCE(${data.description}, description),
      price = COALESCE(${data.price}, price),
      location = COALESCE(${data.location}, location),
      category = COALESCE(${data.category}, category),
      type = COALESCE(${data.type}, type),
      status = COALESCE(${data.status}, status),
      image_url = COALESCE(${data.image_url}, image_url),
      images = COALESCE(${data.images || null}, images),
      video_url = COALESCE(${data.video_url || null}, video_url),
      beds = COALESCE(${data.beds || null}, beds),
      baths = COALESCE(${data.baths || null}, baths),
      area = COALESCE(${data.area || null}, area),
      make = COALESCE(${data.make || null}, make),
      model = COALESCE(${data.model || null}, model),
      year = COALESCE(${data.year || null}, year),
      mileage = COALESCE(${data.mileage || null}, mileage),
      transmission = COALESCE(${data.transmission || null}, transmission),
      fuel_type = COALESCE(${data.fuel_type || null}, fuel_type),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return (property as unknown as Property) || null;
}

export async function deleteProperty(id: string): Promise<boolean> {
  const result = await sql`DELETE FROM properties WHERE id = ${id} RETURNING id`;
  return result.length > 0;
}

export async function getPropertiesGallery(limit = 10): Promise<Pick<Property, 'id' | 'title' | 'price' | 'status' | 'image_url'>[]> {
  const rows = await sql`
    SELECT id, title, price, status, image_url 
    FROM properties 
    ORDER BY created_at DESC LIMIT ${limit}
  `;
  return rows as Pick<Property, 'id' | 'title' | 'price' | 'status' | 'image_url'>[];
}

export async function getDashboardStats(): Promise<{
  totalProperties: number;
  forSale: number;
  forRent: number;
  vehicles: number;
}> {
  const [result] = await sql`
    SELECT
      COUNT(*)::int AS "totalProperties",
      COUNT(*) FILTER (WHERE status = 'For Sale')::int AS "forSale",
      COUNT(*) FILTER (WHERE status = 'For Rent')::int AS "forRent",
      COUNT(*) FILTER (WHERE category IN ('Vehicles', 'Motorcycles'))::int AS "vehicles"
    FROM properties
  `;
  return result as unknown as {
    totalProperties: number;
    forSale: number;
    forRent: number;
    vehicles: number;
  };
}
