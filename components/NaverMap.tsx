"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { OSAN_CENTER } from "@/lib/constants";

export interface DongMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  count: number;
}

interface NaverMapProps {
  markers: DongMarker[];
  height?: string;
}

declare global {
  interface Window {
    naver?: {
      maps: {
        Map: new (el: HTMLElement, opts: Record<string, unknown>) => NaverMapInstance;
        LatLng: new (lat: number, lng: number) => unknown;
        LatLngBounds: new () => { extend: (latlng: unknown) => void };
        Marker: new (opts: Record<string, unknown>) => NaverMarkerInstance;
        Event: { addListener: (target: unknown, type: string, handler: () => void) => void };
        Position: { TOP_RIGHT: number };
      };
    };
    __naverMapLoader?: Promise<void>;
  }
}

interface NaverMapInstance {
  fitBounds: (bounds: unknown) => void;
  setZoom: (z: number) => void;
}
interface NaverMarkerInstance {
  setMap: (m: NaverMapInstance | null) => void;
}

const CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

function loadNaverScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if (window.naver?.maps) return Promise.resolve();
  if (window.__naverMapLoader) return window.__naverMapLoader;

  window.__naverMapLoader = new Promise((resolve, reject) => {
    if (!CLIENT_ID) {
      reject(new Error("NEXT_PUBLIC_NAVER_MAP_CLIENT_ID 미설정"));
      return;
    }
    const s = document.createElement("script");
    s.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${CLIENT_ID}`;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("네이버 지도 스크립트 로드 실패"));
    document.head.appendChild(s);
  });
  return window.__naverMapLoader;
}

function markerHtml(name: string, count: number): string {
  const accent = count > 0 ? "#003b8e" : "#94a3b8";
  return `
    <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;transform:translate(-50%,-100%);">
      <div style="background:${accent};color:#fff;font-weight:800;font-size:12px;padding:6px 12px;border-radius:999px;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.18);border:2px solid #fff;">
        ${name} <span style="background:#ffd54a;color:#0a1633;padding:1px 7px;border-radius:999px;margin-left:4px;font-size:11px;">${count}</span>
      </div>
      <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid ${accent};margin-top:-1px;"></div>
    </div>
  `;
}

export function NaverMap({ markers, height = "560px" }: NaverMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const created: NaverMarkerInstance[] = [];

    loadNaverScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.naver) return;
        const { naver } = window;

        const map = new naver.maps.Map(containerRef.current, {
          center: new naver.maps.LatLng(OSAN_CENTER.lat, OSAN_CENTER.lng),
          zoom: 13,
          minZoom: 11,
          maxZoom: 17,
          zoomControl: true,
          zoomControlOptions: { position: naver.maps.Position.TOP_RIGHT },
        });

        const bounds = new naver.maps.LatLngBounds();

        markers.forEach((m) => {
          const latlng = new naver.maps.LatLng(m.lat, m.lng);
          bounds.extend(latlng);

          const marker = new naver.maps.Marker({
            position: latlng,
            map,
            icon: {
              content: markerHtml(m.name, m.count),
              anchor: { x: 0, y: 0 },
            },
          });
          naver.maps.Event.addListener(marker, "click", () => {
            router.push(`/voices?dong=${m.id}`);
          });
          created.push(marker);
        });

        map.fitBounds(bounds);
      })
      .catch((e) => {
        console.error("[NaverMap]", e);
      });

    return () => {
      cancelled = true;
      created.forEach((m) => m.setMap(null));
    };
  }, [markers, router]);

  if (!CLIENT_ID) {
    return (
      <div
        className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-sm text-gray-500"
        style={{ height }}
      >
        지도 키(NEXT_PUBLIC_NAVER_MAP_CLIENT_ID)가 설정되지 않았습니다.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full rounded-2xl overflow-hidden border border-gray-200"
      style={{ height }}
    />
  );
}
