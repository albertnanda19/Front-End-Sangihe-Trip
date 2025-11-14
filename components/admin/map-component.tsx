"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function MapComponent({ lat, lng, setLat, setLng, setAddress }: {
  lat: number | null;
  lng: number | null;
  setLat: (lat: number) => void;
  setLng: (lng: number) => void;
  setAddress: (addr: string) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current || leafletMapRef.current) {
      return;
    }

    const map = L.map(mapRef.current).setView([3.5, 125.5], 10);
    map.getContainer().style.zIndex = '1';
    setIsMapReady(true);
    leafletMapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(map);
      }

      setLat(lat);
      setLng(lng);

      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then(data => {
          setAddress(data.display_name || "");
        })
        .catch(() => setAddress(""));
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [isClient, setLat, setLng, setAddress]);

  useEffect(() => {
    if (isMapReady && lat !== null && lng !== null) {
      console.log('Setting marker at', lat, lng);
      const newLatLng: [number, number] = [lat, lng];

      if (markerRef.current) {
        markerRef.current.setLatLng(newLatLng);
      } else {
        markerRef.current = L.marker(newLatLng).addTo(leafletMapRef.current!);
      }

      leafletMapRef.current!.setView(newLatLng, leafletMapRef.current!.getZoom());
    }
    if (isMapReady && (lat === null || lng === null)) {
      if (markerRef.current) {
        try {
          leafletMapRef.current?.removeLayer(markerRef.current);
        } catch {
        }
        markerRef.current = null;
      }
    }
  }, [isMapReady, lat, lng]);

  if (!isClient) {
    return <div style={{ height: "100%", width: "100%", backgroundColor: "#f3f4f6" }} />;
  }

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />;
}