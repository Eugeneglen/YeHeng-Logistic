"use client";

export function BackgroundTexture() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 overflow-hidden pointer-events-none"
    >
      {/* Route lines */}
      <div className="bg-route-line bg-route-line-1" />
      <div className="bg-route-line bg-route-line-2" />
      <div className="bg-route-line bg-route-line-3" />
      {/* Ambient glow blobs */}
      <div className="bg-glow-blob bg-glow-blob-1" />
      <div className="bg-glow-blob bg-glow-blob-2" />
      <div className="bg-glow-blob bg-glow-blob-3" />
    </div>
  );
}