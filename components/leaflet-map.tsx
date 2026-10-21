"use client";

import "leaflet/dist/leaflet.css";
import Image from "next/image";
import Link from "next/link";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export type MapProject = {
  slug: string;
  title: string;
  domain: string | null;
  studyArea?: string | null;
  coverUrl?: string | null;
  latitude: number;
  longitude: number;
};

export type LeafletMapProps = {
  projects?: MapProject[];
  selected?: [number, number];
  onSelect?: (latitude: number, longitude: number) => void;
  heightClassName?: string;
};

function MapInteraction({ onSelect }: { onSelect?: (latitude: number, longitude: number) => void }) {
  useMapEvents({
    click: (event) => {
      event.target.scrollWheelZoom.enable();
      onSelect?.(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

function FitBounds({ projects }: { projects: MapProject[] }) {
  const map = useMap();

  useEffect(() => {
    if (projects.length < 2) return;
    const bounds: LatLngBoundsExpression = projects.map((project) => [project.latitude, project.longitude]);
    map.fitBounds(bounds, { padding: [28, 28], maxZoom: 12 });
  }, [map, projects]);

  return null;
}

function MapContent({ projects = [], selected, onSelect }: Omit<LeafletMapProps, "heightClassName">) {
  const center: LatLngExpression = selected ?? (projects.length > 0 ? [projects[0].latitude, projects[0].longitude] : [-2.5, 118]);
  const hasProjectMarkers = projects.length > 0;

  return (
    <MapContainer center={center} zoom={hasProjectMarkers ? 5 : 8} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapInteraction onSelect={onSelect} />
      {hasProjectMarkers && <FitBounds projects={projects} />}
      {selected && <Marker position={selected} icon={markerIcon} />}
      {hasProjectMarkers && (
        <MarkerClusterGroup chunkedLoading>
          {projects.map((project) => (
            <Marker key={project.slug} position={[project.latitude, project.longitude]} icon={markerIcon}>
              <Popup>
                <div className="min-w-[180px] space-y-2">
                  {project.coverUrl && <Image src={project.coverUrl} alt="" width={180} height={90} className="h-[90px] w-full rounded object-cover" />}
                  <strong className="block">{project.title}</strong>
                  {project.domain && <p className="text-xs">{project.domain}</p>}
                  {project.studyArea && <p className="text-xs">{project.studyArea}</p>}
                  <Link href={`/projects/${project.slug}`} className="font-semibold underline">View project</Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      )}
    </MapContainer>
  );
}

export function LeafletMap({ heightClassName = "h-[300px]", ...props }: LeafletMapProps) {
  return <div className={`${heightClassName} w-full overflow-hidden rounded-2xl border border-[var(--line)]`}><MapContent {...props} /></div>;
}
