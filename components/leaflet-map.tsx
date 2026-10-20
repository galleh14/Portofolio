"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type MapProject = { slug: string; title: string; domain: string | null; latitude: number; longitude: number };
export type LeafletMapProps = { projects?: MapProject[]; selected?: [number, number]; onSelect?: (latitude: number, longitude: number) => void };

function ClickHandler({ onSelect }: { onSelect: (latitude: number, longitude: number) => void }) {
  useMapEvents({ click: (event) => onSelect(event.latlng.lat, event.latlng.lng) });
  return null;
}

function MapContent({ projects, selected, onSelect }: { projects: MapProject[]; selected?: [number, number]; onSelect?: (latitude: number, longitude: number) => void }) {
  const center: LatLngExpression = selected ?? (projects.length > 0 ? [projects[0].latitude, projects[0].longitude] : [-2.5, 118]);
  return <MapContainer center={center} zoom={selected || projects.length > 0 ? 8 : 4} scrollWheelZoom className="h-full w-full"><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{onSelect && <ClickHandler onSelect={onSelect} />}{selected && <Marker position={selected} icon={markerIcon} />}{projects.map((project) => <Marker key={project.slug} position={[project.latitude, project.longitude]} icon={markerIcon}><Popup><div className="space-y-1"><strong>{project.title}</strong>{project.domain && <p>{project.domain}</p>}<a href={`/projects/${project.slug}`} className="font-semibold underline">Lihat detail</a></div></Popup></Marker>)}</MapContainer>;
}

export function LeafletMap({ projects = [], selected, onSelect }: LeafletMapProps) {
  return <div className="h-[300px] w-full overflow-hidden rounded-2xl border border-[var(--line)]"><MapContent projects={projects} selected={selected} onSelect={onSelect} /></div>;
}
