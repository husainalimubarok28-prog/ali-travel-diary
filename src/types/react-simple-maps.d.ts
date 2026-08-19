declare module "react-simple-maps" {
  import { ComponentType, ReactNode } from "react";

  interface ComposableMapProps {
    projectionConfig?: { scale?: number; center?: [number, number]; rotation?: [number, number, number] };
    style?: React.CSSProperties;
    className?: string;
    children?: ReactNode;
  }

  interface ZoomableGroupProps {
    zoom?: number;
    center?: [number, number];
    maxZoom?: number;
    minZoom?: number;
    children?: ReactNode;
  }

  interface GeographiesProps {
    geography: string;
    children: (data: { geographies: GeographyType[] }) => ReactNode;
  }

  interface GeographyType {
    rsmKey: string;
    properties: { name: string; [key: string]: any };
    [key: string]: any;
  }

  interface GeographyProps {
    key: string;
    geography: GeographyType;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    className?: string;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
  }

  interface MarkerProps {
    key: string;
    coordinates: [number, number];
    children?: ReactNode;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
  export const Marker: ComponentType<MarkerProps>;
}
