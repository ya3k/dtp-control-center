"use client"

import { useState, useEffect, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import Script from 'next/script'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2, Search, MapPin } from "lucide-react"
import destinationApiRequest from "@/apiRequests/destination"
import { 
  CreateDestinationBodySchema,
  CreateDestinationBodyType
} from "@/schemaValidations/admin-destination.schema"

// Define types for MapLibre GL
interface MapLibreMap {
  remove: () => void;
  flyTo: (options: { center: [number, number]; zoom: number }) => void;
  addControl: (control: MapLibreNavigationControl) => void;
  on: (event: string, callback: (e: { lngLat: { lng: number; lat: number } }) => void) => void;
}

interface MarkerOptions {
  color?: string;
  draggable?: boolean;
}

interface LngLat {
  lng: number;
  lat: number;
}

interface MapLibreGL {
  Map: {
    new (options: {
      container: HTMLElement;
      style: string;
      center: [number, number];
      zoom: number;
    }): MapLibreMap;
  };
  NavigationControl: {
    new (): MapLibreNavigationControl;
  };
  Marker: {
    new (options?: MarkerOptions): MapLibreMarker;
  };
}

interface MapLibreNavigationControl {
  onAdd?: (map: MapLibreMap) => HTMLElement;
  onRemove?: () => void;
}

interface MapLibreMarker {
  setLngLat: (coords: [number, number]) => MapLibreMarker;
  addTo: (map: MapLibreMap) => MapLibreMarker;
  remove: () => void;
  getLngLat: () => LngLat;
  on: (event: string, callback: () => void) => void;
}

// Define types for ZIOMAP API response
interface ZiomapResult {
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
  types: string[];
}

interface ZiomapResponse {
  results: ZiomapResult[];
  status: string;
}

declare global {
  interface Window {
    maplibregl: MapLibreGL;
  }
}

interface CreateDestinationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateComplete: () => void
}

export function CreateDestinationDialog({
  open,
  onOpenChange,
  onCreateComplete,
}: CreateDestinationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<ZiomapResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isMapReady, setIsMapReady] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<MapLibreMap | null>(null)
  const marker = useRef<MapLibreMarker | null>(null)

  const form = useForm<CreateDestinationBodyType>({
    resolver: zodResolver(CreateDestinationBodySchema),
    defaultValues: {
      name: "",
      latitude: "",
      longitude: "",
    },
  })

  // Initialize map when showing map and it's ready
  useEffect(() => {
    if (!showMap || !isMapReady || !mapContainer.current || map.current) return;

    try {
      const lat = parseFloat(form.getValues('latitude')) || 21.0278;
      const lng = parseFloat(form.getValues('longitude')) || 105.8342;

      map.current = new window.maplibregl.Map({
        container: mapContainer.current,
        style: 'https://api.maptiler.com/maps/streets/style.json?key=jfuhFK1rEPxjG0UbJpDL',
        center: [lng, lat],
        zoom: 15
      });

      map.current.addControl(new window.maplibregl.NavigationControl());

      // Add click handler for location adjustment
      map.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        updateMarkerPosition(lng, lat);
        form.setValue('longitude', lng.toFixed(6));
        form.setValue('latitude', lat.toFixed(6));
      });

      // Add initial marker
      updateMarkerPosition(lng, lat);

    } catch (error) {
      console.error('Error initializing map:', error);
      toast.error('Không thể tải bản đồ');
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [showMap, isMapReady, form]);

  // Update marker position
  const updateMarkerPosition = (lng: number, lat: number) => {
    if (!map.current) return;

    if (marker.current) {
      marker.current.remove();
    }

    marker.current = new window.maplibregl.Marker({
      color: '#FF0000',
      draggable: true
    })
      .setLngLat([lng, lat])
      .addTo(map.current);

    // Add drag end event to update form values
    marker.current.on('dragend', () => {
      const lngLat = marker.current?.getLngLat();
      if (lngLat) {
        form.setValue('longitude', lngLat.lng.toFixed(6));
        form.setValue('latitude', lngLat.lat.toFixed(6));
      }
    });
  };

  // Handle search using our proxy API
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/proxy/geocoding?address=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Search request failed');
      }
      
      const data: ZiomapResponse = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        setSearchResults(data.results);
      } else {
        toast.error('Không tìm thấy địa điểm');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Lỗi tìm kiếm địa điểm');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (result: ZiomapResult) => {
    const { lat, lng } = result.geometry.location;
    
    form.setValue('latitude', lat.toString());
    form.setValue('longitude', lng.toString());
    form.setValue('name', result.formatted_address);
    
    // Show map after location selection
    setShowMap(true);
    
    // If map is already initialized, update view
    if (map.current) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 15
      });
      updateMarkerPosition(lng, lat);
    }
    
    // Clear search results after selection
    setSearchQuery('');
    setSearchResults([]);
  };

  // Handle form submission
  const onSubmit = async (data: CreateDestinationBodyType) => {
    setIsSubmitting(true)
    
    try {
      const response = await destinationApiRequest.create(data)
      if (response.status === 201) {
        onCreateComplete()
        toast.success("Tạo điểm đến mới thành công")
        onOpenChange(false)
        form.reset()
        setShowMap(false)
      }
    } catch (error: unknown) {
      console.error("Error creating destination:", error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Failed to create destination")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Load MapLibre scripts when dialog is open */}
      {open && (
        <>
          <Script
            src="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js"
            onLoad={() => {
              console.log('MapLibre script loaded');
              setIsMapReady(true);
            }}
            onError={(e) => {
              console.error('Error loading MapLibre script:', e);
              toast.error('Không thể tải thư viện bản đồ');
            }}
          />
          <link 
            href="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css" 
            rel="stylesheet" 
          />
        </>
      )}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Thêm điểm đến mới</DialogTitle>
            <DialogDescription>
              Tìm kiếm địa điểm và điều chỉnh vị trí chính xác trên bản đồ.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Search Box */}
              <div className="relative">
                <div className="flex gap-2">
                  <Input
                    placeholder="Tìm kiếm địa điểm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                    onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button
                    variant={"outline"}
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="absolute w-full mt-1 bg-white rounded-md border shadow-lg z-50 max-h-[200px] overflow-y-auto">
                    {searchResults.map((result) => (
                      <button
                        key={result.place_id}
                        type="button"
                        className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground text-sm"
                        onClick={() => handleSelectLocation(result)}
                      >
                        <div className="font-medium">{result.formatted_address}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên điểm đến</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Map Container */}
              {showMap && (
                <div className="relative w-full h-[300px] rounded-md border overflow-hidden">
                  <div ref={mapContainer} className="w-full h-full" />
                  {!isMapReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 bg-white/90 p-2 rounded-md text-sm">
                    <p className="text-muted-foreground">
                      <MapPin className="inline-block w-4 h-4 mr-1" />
                      Kéo thả điểm đánh dấu hoặc click vào bản đồ để điều chỉnh vị trí chính xác
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vĩ độ</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kinh độ</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    onOpenChange(false);
                    setShowMap(false);
                  }}
                >
                  Hủy
                </Button>
                <Button variant={"core"} type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Tạo điểm đến
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}