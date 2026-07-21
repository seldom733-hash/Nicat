'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Image } from 'lucide-react';
import { getMediaUrl } from '@/lib/utils';

interface TourGalleryProps {
  media?: { id: string; url: string; caption?: string; sortOrder: number }[];
  title: string;
}

const TOTAL_SLOTS = 10;

export default function TourGallery({ media, title }: TourGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const sortedMedia = media
    ? [...media].sort((a, b) => a.sortOrder - b.sortOrder)
    : [];

  const selectedPhoto = sortedMedia[selectedIndex] || null;
  const slots = Array.from({ length: TOTAL_SLOTS }, (_, i) => sortedMedia[i] || null);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (overlayVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [overlayVisible]);

  const handleMainClick = () => {
    if (!selectedPhoto) return;
    if (overlayVisible) {
      // Close: shrink to center then unmount
      setIsClosing(true);
      setTimeout(() => {
        setOverlayVisible(false);
        setIsClosing(false);
        setIsReady(false);
      }, 400);
    } else {
      // Open: appear at center at scale 0, then grow to scale 1
      setIsClosing(false);
      setOverlayVisible(true);
      setIsReady(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsReady(true));
      });
    }
  };

  const goToPrev = () => setSelectedIndex((i) => (i === 0 ? sortedMedia.length - 1 : i - 1));
  const goToNext = () => setSelectedIndex((i) => (i === sortedMedia.length - 1 ? 0 : i + 1));

  const showOverlay = overlayVisible && selectedPhoto;

  return (
    <>
      {/* Centered main image — 16:9 */}
      <div className="flex justify-center my-4">
        <div
          ref={mainRef}
          className="relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer group shadow-sm"
          style={{ width: 'min(42vw, 500px)', aspectRatio: '16/9' }}
          onClick={handleMainClick}
        >
          {selectedPhoto ? (
            <>
              <img src={getMediaUrl(selectedPhoto.url)} alt={selectedPhoto.caption || title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
              <div className="absolute top-1.5 right-1.5 bg-black/60 text-white px-1.5 py-0.5 rounded text-[10px] pointer-events-none">
                {selectedIndex + 1}/{sortedMedia.length}
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Image className="h-10 w-10" />
            </div>
          )}
        </div>
      </div>

      {/* 10 thumbnails — centered horizontal row */}
      <div className="flex justify-center gap-1.5 mb-6">
        {slots.map((slot, index) => (
          <button key={index} type="button" onClick={() => { if (slot) setSelectedIndex(index); }}
            className={`rounded overflow-hidden border transition-all flex-shrink-0 ${
              index === selectedIndex ? 'border-primary-800 ring-1 ring-primary-800/30'
                : slot ? 'border-gray-200 hover:border-gray-400 cursor-pointer'
                  : 'border-dashed border-gray-300 bg-gray-50 cursor-default'
            }`}
            style={{ width: 'min(8.4vw, 100px)', aspectRatio: '16/9' }}
          >
            {slot ? (
              <img src={getMediaUrl(slot.url)} alt={slot.caption || `Photo ${index + 1}`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Image className="h-2.5 w-2.5 text-gray-300" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* ===== VIEWPORT-LEVEL OVERLAY via Portal ===== */}
      {showOverlay && createPortal(
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: isClosing ? 'none' : 'auto',
          }}
        >
          {/* Dark backdrop — covers entire monitor */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: isClosing ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.85)',
              transition: 'background-color 0.4s ease',
              cursor: 'pointer',
            }}
            onClick={handleMainClick}
          />

          {/* Photo container — centered on MONITOR, scales from 0 to 90% of viewport */}
          <div
            style={{
              position: 'relative',
              width: '90vw',
              maxWidth: '1200px',
              aspectRatio: '16/9',
              zIndex: 1,
              cursor: 'pointer',
              transform: `scale(${!isReady || isClosing ? 0 : 1})`,
              transition: 'transform 0.4s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.3s ease',
              opacity: isClosing ? 0 : 1,
              transformOrigin: 'center center',
            }}
            onClick={handleMainClick}
          >
            <img
              src={getMediaUrl(selectedPhoto.url)}
              alt={selectedPhoto.caption || title}
              className="w-full h-full object-contain rounded-xl"
              style={{ pointerEvents: 'none' }}
            />

            {/* Nav arrows */}
            {sortedMedia.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 p-3 rounded-full transition-colors z-10">
                  <ChevronLeft className="h-7 w-7" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); goToNext(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 p-3 rounded-full transition-colors z-10">
                  <ChevronRight className="h-7 w-7" />
                </button>
              </>
            )}

            {/* Thumbnails at bottom */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className="flex gap-1.5 bg-black/60 backdrop-blur-sm p-1.5 rounded-lg">
                {sortedMedia.map((item, idx) => (
                  <button key={item.id} onClick={(e) => { e.stopPropagation(); setSelectedIndex(idx); }}
                    className={`w-11 h-11 rounded overflow-hidden border-2 transition-all ${
                      idx === selectedIndex ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}>
                    <img src={getMediaUrl(item.url)} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <p className="text-white text-center text-xs mt-1.5 opacity-80">{selectedIndex + 1} / {sortedMedia.length}</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
