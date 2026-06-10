import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: 'white',
            letterSpacing: '4px',
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          HASS
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: 'white',
            letterSpacing: '6px',
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          PROPERTIES
        </div>
        <div
          style={{
            fontSize: 36,
            color: 'rgba(255, 255, 255, 0.85)',
            letterSpacing: '2px',
          }}
        >
          Homes · Lands · Plots · Cars · Rentals
        </div>
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255, 255, 255, 0.7)',
            marginTop: 40,
          }}
        >
          Fort Portal Tourism City, Uganda
        </div>
      </div>
    ),
    { ...size },
  );
}
