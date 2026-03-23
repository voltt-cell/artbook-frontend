import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'ArtBook — The Digital Gallery'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1A1A1A',
        }}
      >
        <div style={{ display: 'flex', position: 'relative', width: 400, height: 400 }}>
          {/* Red Square */}
          <div
            style={{
              position: 'absolute',
              top: 37.5,
              left: 37.5,
              width: 125,
              height: 125,
              backgroundColor: '#D32F2F',
            }}
          />
          {/* 'A' Text */}
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: 270,
              fontFamily: 'serif',
              fontWeight: 900,
            }}
          >
            A
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
