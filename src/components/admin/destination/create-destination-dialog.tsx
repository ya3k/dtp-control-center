"use client"

import { useState, useEffect, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
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
import { Loader2, Search } from "lucide-react"
import destinationApiRequest from "@/apiRequests/destination"
import { 
  CreateDestinationBodySchema,
  CreateDestinationBodyType
} from "@/schemaValidations/admin-destination.schema"
import Script from 'next/script'

// Define types for MapLibre GL
interface MapLibreGL {
  Map: {
    new (options: {
      container: HTMLElement;
      style: string;
      center: [number, number];
      zoom: number;
    }): any;
  };
  NavigationControl: {
    new (): any;
  };
  Marker: {
    new (): {
      setLngLat: (coords: [number, number]) => any;
      addTo: (map: any) => any;
      remove: () => void;
    };
  };
}

// Define types for search results
interface SearchResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    city?: string;
    state?: string;
    country?: string;
    tourism?: string;
    attraction?: string;
    name?: string;
  };
  type: string;
  importance: number;
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
  const [isMapReady, setIsMapReady] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<MapLibreGL['Map'] | null>(null)
  const marker = useRef<MapLibreGL['Marker'] | null>(null)

  const form = useForm<CreateDestinationBodyType>({
    resolver: zodResolver(CreateDestinationBodySchema),
    defaultValues: {
      name: "",
      latitude: "",
      longitude: "",
    },
  })

  // Initialize map
  useEffect(() => {
    if (!open || !isMapReady || !mapContainer.current || map.current) return;

    map.current = new window.maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [105.8342, 21.0278], // Hanoi coordinates
      zoom: 5
    });

    map.current.addControl(new window.maplibregl.NavigationControl());

    map.current.on('click', (e: { lngLat: { lng: number; lat: number } }) => {
      const { lng, lat } = e.lngLat;
      updateMarkerPosition(lng, lat);
      form.setValue('longitude', lng.toFixed(6));
      form.setValue('latitude', lat.toFixed(6));
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [open, isMapReady]);

  // Update marker position
  const updateMarkerPosition = (lng: number, lat: number) => {
    if (!map.current) return;

    if (marker.current) {
      marker.current.remove();
    }

    marker.current = new window.maplibregl.Marker()
      .setLngLat([lng, lat])
      .addTo(map.current);
  };

  // Handle search with better error handling and filtering
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Vui lòng nhập địa điểm cần tìm');
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` + 
        new URLSearchParams({
          q: searchQuery,
          format: 'json',
          limit: '5',
          addressdetails: '1', // Get detailed address information
          'accept-language': 'vi' // Get Vietnamese results when available
        })
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: SearchResult[] = await response.json();
      
      // Filter and sort results to prioritize tourist destinations
      const sortedResults = data
        .filter(result => {
          // Keep results that are likely tourist destinations
          return (
            result.type === 'tourism' ||
            result.type === 'attraction' ||
            result.address?.tourism ||
            result.address?.attraction ||
            result.importance > 0.5
          );
        })
        .sort((a, b) => b.importance - a.importance);

      setSearchResults(sortedResults);
      
      if (sortedResults.length === 0) {
        toast.info('Không tìm thấy địa điểm phù hợp');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Không thể tìm kiếm địa điểm');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle location selection with better name formatting
  const handleSelectLocation = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    // Format the name to be more tourist-friendly
    const name = formatLocationName(result);
    
    // Update form
    form.setValue('name', name);
    form.setValue('latitude', lat.toFixed(6));
    form.setValue('longitude', lng.toFixed(6));
    
    // Update map
    updateMarkerPosition(lng, lat);
    map.current?.flyTo({ center: [lng, lat], zoom: 15 });
    
    // Clear search
    setSearchQuery('');
    setSearchResults([]);
  };

  // Format location name for better display
  const formatLocationName = (result: SearchResult): string => {
    // Try to get the most relevant name for a tourist destination
    const name = result.address?.tourism || 
                 result.address?.attraction ||
                 result.address?.name ||
                 result.display_name.split(',')[0];

    const city = result.address?.city;
    const country = result.address?.country;

    if (city && country) {
      return `${name}, ${city}, ${country}`;
    } else if (city) {
      return `${name}, ${city}`;
    } else {
      return name;
    }
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

  // Handle coordinate input changes
  const handleCoordinateChange = (field: 'latitude' | 'longitude', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const lng = field === 'longitude' ? numValue : parseFloat(form.getValues('longitude'));
      const lat = field === 'latitude' ? numValue : parseFloat(form.getValues('latitude'));
      if (map.current && !isNaN(lng) && !isNaN(lat)) {
        updateMarkerPosition(lng, lat);
        map.current.flyTo({ center: [lng, lat], zoom: 12 });
      }
    }
  };

  return (
    <>
      <Script
        src="https://unpkg.com/maplibre-gl/dist/maplibre-gl.js"
        onLoad={() => setIsMapReady(true)}
      />
      <link 
        href="https://unpkg.com/maplibre-gl/dist/maplibre-gl.css" 
        rel="stylesheet" 
      />
      
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Thêm điểm đến mới</DialogTitle>
            <DialogDescription>
              Tìm kiếm hoặc chọn vị trí trên bản đồ cho điểm đến mới.
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
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button
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
                        <div className="font-medium">{formatLocationName(result)}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {result.display_name}
                        </div>
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
              <div 
                ref={mapContainer} 
                className="w-full h-[300px] rounded-md border mb-4"
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vĩ độ</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            handleCoordinateChange('latitude', e.target.value);
                          }}
                        />
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
                        <Input 
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleCoordinateChange('longitude', e.target.value);
                          }}
                        />
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
                  onClick={() => onOpenChange(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
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