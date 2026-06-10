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
  category      TEXT NOT NULL CHECK (category IN ('Homes', 'Lands', 'Plots', 'Rentals', 'Cars', 'Motorcycles')),
  type          TEXT NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('For Sale', 'For Rent', 'Sold')),
  image_url     TEXT NOT NULL,
  featured      BOOLEAN NOT NULL DEFAULT FALSE,
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

CREATE TABLE IF NOT EXISTS agents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  title       TEXT NOT NULL,
  photo_url   TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
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

CREATE TABLE IF NOT EXISTS stats (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label      TEXT NOT NULL,
  value      TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO stats (label, value, sort_order)
SELECT * FROM (VALUES
  ('Years of Experience', '11+', 1),
  ('Properties Sold', '100+', 2),
  ('Happy Clients', '200+', 3),
  ('Listings Available', '50+', 4)
) AS v
WHERE NOT EXISTS (SELECT 1 FROM stats LIMIT 1);

-- === Testimonials Table ===

CREATE TABLE IF NOT EXISTS testimonials (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  role       TEXT NOT NULL,
  quote      TEXT NOT NULL,
  rating     INT NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  approved   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO testimonials (name, role, quote, rating)
SELECT * FROM (VALUES
  ('Sarah Akello','First-Time Homeowner','I was terrified of being scammed, which is so common in real estate. Hass Properties walked me through the title verification step-by-step. I am now a proud homeowner in Booma!',5),
  ('John Tumusiime','Property Investor','I have bought three commercial properties through them. Their local expertise in Fort Portal is unmatched. They know where the city is expanding before anyone else does.',5),
  ('Mary Katusiime','Business Owner','Professional, reliable, and honest. They helped me secure a prime commercial spot for my restaurant in just two weeks. Outstanding speed and service.',5),
  ('David Otim','Land Buyer','The transparency is what hooked me. They showed me the land, provided the exact coordinates, and handled the transfer process without any hidden fees.',5),
  ('Grace Namaganda','Expat Relocating','Moving back to Uganda after 10 years abroad was daunting. Hass Properties found me a fully furnished rental that felt like home immediately.',5),
  ('Peter Mugisha','Vehicle Buyer','Not only do they do real estate, but they helped me import a pristine Toyota Hilux. The paperwork was flawless. Highly recommend their vehicle division.',5),
  ('Dr. Alice Kemigisha','Medical Professional','With my busy schedule at the hospital, I did not have time to property hunt. They curated a list of 5 perfect homes, and I bought the second one I saw.',5),
  ('Michael Byaruhanga','Retiree','I wanted a quiet piece of land overlooking the Rwenzori Mountains for my retirement. They found a gem that was not even listed publicly yet.',5),
  ('Juliet Nansubuga','Retail Entrepreneur','They negotiated a fantastic lease rate for my boutique in the city center. Their agents truly advocate for their clients best interests.',5),
  ('Robert Kigozi','Real Estate Developer','As a developer, I need large tracts of clear land. Hass Properties does the due diligence so I do not have to. A true B2B partner.',5),
  ('Esther Asiimwe','Family Home Buyer','We needed a home near good schools for our three kids. The agent was so patient, showing us over 10 properties until we found the one.',5),
  ('James Kato','Motorcycle Enthusiast','Bought my Yamaha dirt bike through them. The mechanical inspection report they provided gave me 100% confidence in the purchase.',5),
  ('Sarah Nakato','Diaspora Investor','Investing from London is risky, but Hass Properties provided video tours, drone footage, and legal verification. I trust them completely.',5),
  ('Emmanuel Ssenyonga','First-Time Buyer','I had a very tight budget. Instead of turning me away, they found a beautiful starter plot slightly outside the city that is already appreciating.',5),
  ('Betty Kyomugisha','Landlord','They manage three of my rental properties. The tenants are always vetted properly, and I receive my reports and payments on time, every month.',5),
  ('William Businge','Commercial Farmer','Finding 50 acres of fertile agricultural land with water access was tough until I contacted Hass. They closed the deal in record time.',5),
  ('Catherine Atuhaire','Luxury Home Buyer','The level of discretion and professionalism they showed while helping us acquire our estate was world-class. Truly the best in Fort Portal.',5),
  ('Joseph Mukasa','Student Housing Investor','They advised me to invest in hostels near the university. Best financial decision I have ever made. Their market foresight is brilliant.',5),
  ('Florence Nabirye','Widow','After my husband passed, I needed to downsize. They handled the sale of my large home and the purchase of a smaller one with such deep compassion.',5),
  ('Paul Kanyike','Logistics Manager','We needed a fleet of 5 delivery trucks. Hass Properties sourced them, inspected them, and delivered them under budget.',5),
  ('Agnes Mutesi','Airbnb Host','They helped me find the perfect apartment to turn into an Airbnb. They even advised on the best neighborhoods for tourist foot traffic.',5),
  ('Richard Ssebaggala','Construction CEO','We buy all our development plots through Hass. Their legal team ensures every title is clean, saving us from endless court battles.',5),
  ('Prossy Najjuma','Single Mother','I thought buying a home on a single income was impossible. They connected me with a great mortgage partner and found a home within my means.',5),
  ('Ivan Kintu','Tech Entrepreneur','Everything was digital! I signed contracts online, viewed properties via video call, and transferred funds securely. Very modern agency.',5),
  ('Lillian Apio','Restaurant Owner','They did not just find me a building; they found a location with the exact zoning, parking, and foot traffic my restaurant needed to thrive.',5),
  ('Moses Ochieng','Car Enthusiast','Traded in my old SUV for a newer model. The valuation was fair, and the swap was completed in a single afternoon. Zero hassle.',5),
  ('Dr. Susan Kembabazi','Clinic Founder','Setting up a new clinic requires specific facilities. Hass Properties found a building that saved us thousands in renovation costs.',5),
  ('Simon Peter','NGO Director','We needed office space for 50 staff members with high-speed internet access. They delivered exactly what we asked for within a week.',5),
  ('Justine Namuli','Property Seller','My house sat on the market for 8 months with another broker. Hass took over, took professional photos, and sold it in 3 weeks.',5),
  ('Arthur Mwebaze','Warehouse Owner','Industrial real estate is tricky, but their team knows the zoning laws inside and out. A highly competent group of professionals.',5),
  ('Brenda Kiconco','Newlywed','They helped us find our first apartment together. The agent actually listened to our needs instead of just pushing expensive places.',5),
  ('Charles Lwanga','Fleet Operator','Bought three commercial vans for my business. The vehicles were exactly as described, no hidden mechanical issues. Honest brokers.',5),
  ('Diana Nkemba','Vacation Home Buyer','We wanted a getaway home near the crater lakes. The property they found us is breathtaking. It is our family favorite place on earth.',5),
  ('Edward Ssekandi','Land Speculator','I buy land to hold and sell later. Hass Properties always tips me off on the upcoming growth corridors in the region.',5),
  ('Fiona Mutoni','Boutique Hotel Owner','They sourced a historic property that we converted into a boutique hotel. Their vision for what a property could be is inspiring.',5),
  ('George Kutesa','Civil Servant','I appreciate their strict adherence to the law. Every document was stamped, verified, and legally binding. I slept peacefully knowing my money was safe.',5),
  ('Harriet Nankya','Bakery Owner','They found me a commercial kitchen space that already had the heavy-duty electrical wiring I needed. Saved me a fortune!',5),
  ('Isaac Musinguzi','First-Time Seller','I had no idea how to price my land. They gave me a free, accurate valuation and got me 15% more than I originally expected.',5),
  ('Jane Frances','Corporate Executive','Relocating for work is stressful. Hass had a luxury apartment ready for me to view the day I landed. I signed the lease the next morning.',5),
  ('Kenneth Opolot','Agriculture Investor','Bought 100 acres for a maize farm. They even helped me verify the soil quality and water table before closing the deal. Above and beyond.',5),
  ('Lucy Akoth','Interior Designer','I buy fixer-uppers, renovate, and flip them. Hass Properties is my go-to source for finding undervalued properties with great bones.',5),
  ('Martin Sserwadda','Transport Business','Financing a commercial truck was proving difficult until Hass connected me with their partner bank. I was on the road making money in weeks.',5),
  ('Nelly Babirye','Event Planner','I needed a large compound for hosting outdoor events. They found a stunning property with manicured gardens that my clients absolutely love.',5),
  ('Oliver Kizza','Expat Teacher','They made sure my rental contract was fair and protected me as a tenant. It is rare to find an agency that cares about the renter just as much as the landlord.',5),
  ('Patrick Ndawula','Hardware Store Owner','Secured a prime corner plot for my new hardware branch. The visibility is incredible, and my sales have doubled since moving there.',5),
  ('Queen Kemigisha','Salon Owner','The agent negotiated a grace period on my rent while I was renovating the salon space. That kind of advocacy is priceless for a small business.',5),
  ('Raymond Okello','Tour Operator','Bought two safari land cruisers through them. They understood exactly what modifications I needed for the national parks. Excellent service.',5),
  ('Stella Namanya','Retiring Teacher','I invested my pension into two rental units they recommended. The passive income is steady, and they handle all the maintenance headaches.',5),
  ('Timothy Kasozi','Tech Worker','Working remotely means I need a quiet home with fiber internet. They knew exactly which neighborhoods in Fort Portal could accommodate me.',5),
  ('Victoria Nansikombi','Family Estate Executor','Selling our late parents estate was emotional and legally complex. Hass Properties handled it with incredible tact, patience, and legal expertise.',5)
) AS v
WHERE NOT EXISTS (SELECT 1 FROM testimonials LIMIT 1);

-- === Source column for stats + auto seeds ===

ALTER TABLE stats ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'manual';

UPDATE stats SET source = 'auto_listings' WHERE label = 'Listings Available' AND source = 'manual';

INSERT INTO stats (label, value, sort_order, source)
SELECT 'Client Testimonials', '0', 5, 'auto_testimonials'
WHERE NOT EXISTS (SELECT 1 FROM stats WHERE label = 'Client Testimonials');

ALTER TABLE properties ADD COLUMN IF NOT EXISTS image_metadata JSONB NOT NULL DEFAULT '[]';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT FALSE;

-- === Indexes ===

CREATE INDEX IF NOT EXISTS idx_properties_category     ON properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_status       ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_created_at   ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_cat_stat     ON properties(category, status);
CREATE INDEX IF NOT EXISTS idx_properties_featured     ON properties(featured);
CREATE INDEX IF NOT EXISTS idx_inquiries_read          ON inquiries(read);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at    ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved    ON testimonials(approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at  ON testimonials(created_at DESC);

-- === Seed Data: 9 sample properties ===

INSERT INTO properties (title, description, price, location, category, type, status, featured, image_url, images, beds, baths, area, video_url, make, model, year, mileage, transmission, fuel_type)
SELECT * FROM (VALUES
  (
    'Modern Family Home in Booma',
    'A beautiful modern family home located in the upscale Booma residential area. Features spacious living areas, a modern kitchen, and a well-maintained garden.',
    'UGX 450,000,000', 'Booma, Fort Portal',
    'Homes', 'House', 'For Sale', TRUE,
    'https://images.unsplash.com/photo-1600596542815-2250657d2fc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1600596542815-2250657d2fc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80','https://images.unsplash.com/photo-1600607687931-cebf0746e50e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80','https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'],
    4, 3, '25 Decimals', 'https://www.youtube.com/embed/tgbNymZ7vqY',
    NULL, NULL, NULL, NULL, NULL, NULL
  ),
  (
    'Prime Commercial Plot',
    'Strategic commercial plot located near the city center. Ideal for a shopping mall, office complex, or hotel. Titled land with easy access to main roads.',
    'UGX 150,000,000', 'Fort Portal City Center',
    'Plots', 'Plot', 'For Sale', FALSE,
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '{}', NULL, NULL, '50x100 ft', NULL,
    NULL, NULL, NULL, NULL, NULL, NULL
  ),
  (
    'Luxury Apartment with Mountain View',
    'Fully furnished luxury apartment offering breathtaking views of the Rwenzori Mountains. Includes 24/7 security, parking, and backup power.',
    'UGX 1,500,000 / Month', 'Boma, Fort Portal',
    'Rentals', 'Apartment', 'For Rent', TRUE,
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '{}', 2, 2, '120 sqm', NULL,
    NULL, NULL, NULL, NULL, NULL, NULL
  ),
  (
    'Farm Land in Kyenjojo',
    'Fertile farm land suitable for tea, coffee, or cattle farming. Located 15km from Fort Portal city with good access roads.',
    'UGX 25,000,000 per Acre', 'Kyenjojo District',
    'Lands', 'Land', 'For Sale', FALSE,
    'https://images.unsplash.com/photo-1500076656116-558758c991c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '{}', NULL, NULL, '10 Acres', NULL,
    NULL, NULL, NULL, NULL, NULL, NULL
  ),
  (
    'Colonial Style Bungalow',
    'Charming colonial-style bungalow with renovated interiors. Large compound with mature trees and a separate servant quarter.',
    'UGX 380,000,000', 'Kabarole Hill',
    'Homes', 'House', 'For Sale', TRUE,
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '{}', 3, 2, '30 Decimals', NULL,
    NULL, NULL, NULL, NULL, NULL, NULL
  ),
  (
    'Lake View Resort Land',
    'Exclusive land overlooking one of the crater lakes. Perfect for an eco-lodge or luxury resort development.',
    'UGX 800,000,000', 'Crater Lakes Region',
    'Lands', 'Land', 'For Sale', FALSE,
    'https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '{}', NULL, NULL, '5 Acres', NULL,
    NULL, NULL, NULL, NULL, NULL, NULL
  ),
  (
    'Toyota Land Cruiser Prado TX',
    'Excellent condition Toyota Land Cruiser Prado TX. Perfect for both city driving and upcountry terrain. Fully serviced with new tires.',
    'UGX 120,000,000', 'Fort Portal City Center',
    'Cars', 'Car', 'For Sale', FALSE,
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '{}', NULL, NULL, NULL, NULL,
    NULL, NULL, 2015, '85,000 km', 'Automatic', 'Diesel'
  ),
  (
    'Subaru Forester XT',
    'Well-maintained Subaru Forester XT. Great family car with AWD capability. Clean interior and exterior.',
    'UGX 45,000,000', 'Booma, Fort Portal',
    'Cars', 'Car', 'For Sale', FALSE,
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '{}', NULL, NULL, NULL, NULL,
    NULL, NULL, 2012, '110,000 km', 'Automatic', 'Petrol'
  ),
  (
    'Yamaha YZ250F Dirt Bike',
    'High-performance dirt bike, perfect for off-road trails around the crater lakes. Recently serviced and ready to ride.',
    'UGX 15,000,000', 'Kabarole',
    'Motorcycles', 'Motorcycle', 'For Sale', FALSE,
    'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '{}', NULL, NULL, NULL, NULL,
    'Yamaha', 'YZ250F', 2019, '2,500 km', 'Manual', 'Petrol'
  )
) AS v
WHERE NOT EXISTS (SELECT 1 FROM properties LIMIT 1);

-- === Seed Data: 3 sample agents ===

INSERT INTO agents (name, title, photo_url, sort_order)
SELECT * FROM (VALUES
  ('Hassan Kintu', 'Founder & CEO', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 1),
  ('Sarah Nabatanzi', 'Senior Agent', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 2),
  ('David Mugisha', 'Property Consultant', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 3)
) AS v
WHERE NOT EXISTS (SELECT 1 FROM agents LIMIT 1);
