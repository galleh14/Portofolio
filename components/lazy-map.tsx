"use client";

import dynamic from "next/dynamic";
import type { LeafletMapProps } from "@/components/leaflet-map";

const DynamicLeafletMap = dynamic(() => import("@/components/leaflet-map").then((module) => module.LeafletMap), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full animate-pulse rounded-2xl bg-[var(--line)]" />,
});

export function LazyMap(props: LeafletMapProps) {
  return <DynamicLeafletMap {...props} />;
}
