-- =============================================================================
-- HASS QUALITY PROPERTIES — Database Schema for Neon (PostgreSQL)
-- =============================================================================
-- Run this entire file in the Neon SQL Editor once your database is created.
-- Everything is idempotent (IF NOT EXISTS) — safe to run multiple times.
-- =============================================================================

-- === Extensions ===

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- === Tables ===

CREATE TABLE IF NOT EXISTS properties (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  price         TEXT NOT NULL,
  location      TEXT NOT NULL,
  category      TEXT NOT NULL CHECK (category IN ('Real Estate', 'Rentals', 'Vehicles', 'Motorcycles')),
  type          TEXT NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('For Sale', 'For Rent', 'Sold')),
  image_url     TEXT NOT NULL,
  images        TEXT[] DEFAULT '{}',
  video_url     TEXT,
  beds          INTEGER,
  baths         INTEGER,
  area          TEXT,
  make          TEXT,
  model         TEXT,
  year          INTEGER,
  mileage       TEXT,
  transmission  TEXT,
  fuel_type     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inquiries (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  email          TEXT NOT NULL,
  phone          TEXT,
  message        TEXT NOT NULL,
  property_title TEXT,
  read           BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- === Indexes ===

CREATE INDEX IF NOT EXISTS idx_properties_category     ON properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_status       ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_created_at   ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_cat_stat     ON properties(category, status);
CREATE INDEX IF NOT EXISTS idx_inquiries_read          ON inquiries(read);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at    ON inquiries(created_at DESC);

-- === Seed Data: 9 sample properties ===

INSERT INTO properties (title, description, price, location, category, type, status, image_url, images, beds, baths, area, video_url)
SELECT * FROM (VALUES
  (
    'Modern Family Home in Booma',
    'A beautiful modern family home located in the upscale Booma residential area. Features spacious living areas, a modern kitchen, and a well-maintained garden.',
    'UGX 450,000,000', 'Booma, Fort Portal',
    'Real Estate', 'House', 'For Sale',
    'https://images.unsplash.com/photo-1600596542815-2250657d2fc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1600596542815-2250657d2fc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80','https://images.unsplash.com/photo-1600607687931-cebf0746e50e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80','https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'],
    4, 3, '25 Decimals',
    'https://www.youtube.com/embed/tgbNymZ7vqY'
  ),
  (
    'Prime Commercial Plot',
    'Strategic commercial plot located near the city center. Ideal for a shopping mall, office complex, or hotel. Titled land with easy access to main roads.',
    'UGX 150,000,000', 'Fort Portal City Center',
    'Real Estate', 'Land', 'For Sale',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '{}', NULL, NULL, '50x100 ft', NULL
  ),
  (
    'Luxury Apartment with Mountain View',
    'Fully furnished luxury apartment offering breathtaking views of the Rwenzori Mountains. Includes 24/7 security, parking, and backup power.',
    'UGX 1,500,000 / Month', 'Boma, Fort Portal',
    'Rentals', 'Apartment', 'For Rent',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '{}', 2, 2, '120 sqm', NULL
  ),
  (
    'Farm Land in Kyenjojo',
    'Fertile farm land suitable for tea, coffee, or cattle farming. Located 15km from Fort Portal city with good access roads.',
    'UGX 25,000,000 per Acre', 'Kyenjojo District',
    'Real Estate', 'Land', 'For Sale',
    'https://images.unsplash.com/photo-1500076656116-558758c991c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '{}', NULL, NULL, '10 Acres', NULL
  ),
  (
    'Colonial Style Bungalow',
    'Charming colonial-style bungalow with renovated interiors. Large compound with mature trees and a separate servant quarter.',
    'UGX 380,000,000', 'Kabarole Hill',
    'Real Estate', 'House', 'For Sale',
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '{}', 3, 2, '30 Decimals', NULL
  ),
  (
    'Lake View Resort Land',
    'Exclusive land overlooking one of the crater lakes. Perfect for an eco-lodge or luxury resort development.',
    'UGX 800,000,000', 'Crater Lakes Region',
    'Real Estate', 'Land', 'For Sale',
    'https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '{}', NULL, NULL, '5 Acres', NULL
  ),
  (
    'Toyota Land Cruiser Prado TX',
    'Excellent condition Toyota Land Cruiser Prado TX. Perfect for both city driving and upcountry terrain. Fully serviced with new tires.',
    'UGX 120,000,000', 'Fort Portal City Center',
    'Vehicles', 'Car', 'For Sale',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '{}', NULL, NULL, NULL,
    NULL, NULL, 2015, '85,000 km', 'Automatic', 'Diesel'
  ),
  (
    'Subaru Forester XT',
    'Well-maintained Subaru Forester XT. Great family car with AWD capability. Clean interior and exterior.',
    'UGX 45,000,000', 'Booma, Fort Portal',
    'Vehicles', 'Car', 'For Sale',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '{}', NULL, NULL, NULL,
    NULL, NULL, 2012, '110,000 km', 'Automatic', 'Petrol'
  ),
  (
    'Yamaha YZ250F Dirt Bike',
    'High-performance dirt bike, perfect for off-road trails around the crater lakes. Recently serviced and ready to ride.',
    'UGX 15,000,000', 'Kabarole',
    'Motorcycles', 'Motorcycle', 'For Sale',
    'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '{}', NULL, NULL, NULL,
    'Yamaha', 'YZ250F', 2019, '2,500 km', 'Manual', 'Petrol'
  )
) AS v
WHERE NOT EXISTS (SELECT 1 FROM properties LIMIT 1);
