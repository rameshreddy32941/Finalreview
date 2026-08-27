'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapPin, Navigation, Eye, Ear, Wind, Utensils, Hand, Stethoscope, Building2, Loader2, Search, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type HospitalType = {
  id: string;
  label: string;
  icon: typeof Eye;
  query: string;
  color: string;
  terms: string[];
};

const hospitalTypes: HospitalType[] = [
  {
    id: 'eye',
    label: 'Eye Hospitals',
    icon: Eye,
    query: 'ophthalmology, eye clinic, eye hospital',
    terms: ['ophthalmology', 'eye hospital', 'eye clinic'],
    color: 'text-primary',
  },
  {
    id: 'ear',
    label: 'ENT Specialists',
    icon: Ear,
    query: 'ENT, otolaryngology, ear nose throat',
    terms: ['ENT', 'otolaryngology', 'ear nose throat', 'ear clinic', 'nose clinic', 'throat clinic'],
    color: 'text-chart-2',
  },
  {
    id: 'skin',
    label: 'Dermatologists',
    icon: Hand,
    query: 'dermatologist, dermatology clinic',
    terms: ['dermatologist', 'dermatology clinic', 'skin clinic'],
    color: 'text-chart-4',
  },
  {
    id: 'tongue',
    label: 'Dental Care',
    icon: Utensils,
    query: 'dentist, dental clinic, dental hospital',
    terms: ['dentist', 'dental clinic', 'dental hospital'],
    color: 'text-chart-5',
  },
  {
    id: 'general',
    label: 'General Hospitals',
    icon: Building2,
    query: 'hospital, general hospital, medical centre',
    terms: ['hospital', 'general hospital', 'medical centre', 'medical center'],
    color: 'text-chart-3',
  },
];

type HospitalResult = {
  name: string;
  specialty: string;
  address: string;
  lat: number;
  lon: number;
  distanceKm: number;
  phone?: string;
  website?: string;
  openingHours?: string;
};

type LocationDetails = {
  lat: number;
  lon: number;
  label: string;
};

export default function HospitalsPage() {
  return (
    <Suspense fallback={<div className="flex h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>}>
      <HospitalsContent />
    </Suspense>
  );
}

function HospitalsContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || 'eye';
  const [activeType, setActiveType] = useState(initialType);
  const [manualQuery, setManualQuery] = useState('');
  const [results, setResults] = useState<HospitalResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionMessage, setPermissionMessage] = useState<string | null>(null);
  const [locationLabel, setLocationLabel] = useState('your location');
  const [locationCoords, setLocationCoords] = useState<LocationDetails | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<HospitalResult | null>(null);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'ready' | 'blocked'>('loading');

  const current = hospitalTypes.find((t) => t.id === activeType) || hospitalTypes[0];

  const searchQuery = useMemo(() => {
    const baseQuery = `${current.query} near ${locationLabel}`.trim();
    return baseQuery.replace(/\s+/g, ' ');
  }, [current.query, locationLabel]);

  const mapsUrl = useMemo(() => {
    if (selectedHospital) {
      const center = `${selectedHospital.lat},${selectedHospital.lon}`;
      return `https://www.google.com/maps?q=${encodeURIComponent(`${selectedHospital.name} ${selectedHospital.address}`)}&center=${encodeURIComponent(center)}&output=embed`;
    }

    if (locationCoords) {
      return `https://www.google.com/maps/search/${encodeURIComponent(current.query)}/@${locationCoords.lat},${locationCoords.lon},14z?output=embed`;
    }

    return `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}&output=embed`;
  }, [current.query, locationCoords, selectedHospital]);

  const directionsUrl = useMemo(() => {
    if (selectedHospital) {
      return `https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.lat},${selectedHospital.lon}`;
    }

    if (locationCoords) {
      return `https://www.google.com/maps/search/${encodeURIComponent(current.query)}/@${locationCoords.lat},${locationCoords.lon},14z`;
    }

    return `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
  }, [current.query, locationCoords, selectedHospital, searchQuery]);

  const geocodeLocation = async (query: string): Promise<LocationDetails> => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Unable to geocode the location right now.');
    }
    const data = await response.json();
    if (!data?.[0]) throw new Error('No matching location was found.');
    return {
      lat: Number(data[0].lat),
      lon: Number(data[0].lon),
      label: data[0].display_name,
    };
  };

  const getIpLocation = async (): Promise<LocationDetails | null> => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) return null;
      const data = await response.json();
      if (!data?.latitude || !data?.longitude) return null;
      return {
        lat: Number(data.latitude),
        lon: Number(data.longitude),
        label: [data.city, data.region, data.country_name].filter(Boolean).join(', '),
      };
    } catch {
      return null;
    }
  };

  const haversineDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRadians = (value: number) => (value * Math.PI) / 180;
    const earthRadiusKm = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  };

  const fetchNearbyFacilities = async (lat: number, lon: number) => {
    const radiusMeters = 25000;
    const typeConfig = hospitalTypes.find((type) => type.id === activeType) || hospitalTypes[0];

    const specialtyPatterns = typeConfig.terms.map((term) => `(?i)${term}`);
    const specialtyPattern = specialtyPatterns.join('|');

    const buildOverpassQuery = (searchPattern: string, includeGeneral: boolean) => {
      const amenityClause = includeGeneral ? 'hospital|clinic|dentist|doctors' : 'hospital|clinic|dentist|doctors';
      return `[out:json][timeout:25];(
        node["healthcare:speciality"~"${searchPattern}"](around:${radiusMeters},${lat},${lon});
        way["healthcare:speciality"~"${searchPattern}"](around:${radiusMeters},${lat},${lon});
        relation["healthcare:speciality"~"${searchPattern}"](around:${radiusMeters},${lat},${lon});
        node["amenity"~"${amenityClause}"]["name"~"${searchPattern}"](around:${radiusMeters},${lat},${lon});
        way["amenity"~"${amenityClause}"]["name"~"${searchPattern}"](around:${radiusMeters},${lat},${lon});
        relation["amenity"~"${amenityClause}"]["name"~"${searchPattern}"](around:${radiusMeters},${lat},${lon});
      );out center;`;
    };

    const queries = [
      buildOverpassQuery(specialtyPattern, false),
      buildOverpassQuery('(?i)hospital|clinic|medical centre|medical center', true),
    ];

    for (const query of queries) {
      try {
        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          body: `data=${encodeURIComponent(query)}`,
        });

        if (!response.ok) continue;

        const payload = await response.json();
        const mappedResults = (payload.elements || [])
          .map((element: any) => {
            const tags = element.tags || {};
            const center = element.center || (element.lat && element.lon ? { lat: element.lat, lon: element.lon } : null);
            if (!center) return null;

            const name = tags.name || tags['name:en'] || tags.amenity || 'Nearby care center';
            const addressParts = [
              tags['addr:housenumber'],
              tags['addr:street'],
              tags['addr:suburb'] || tags['addr:city'],
              tags['addr:state'],
              tags['addr:country'],
            ].filter(Boolean);
            const address = addressParts.join(', ') || 'Address available on the map';
            const distanceKm = haversineDistanceKm(lat, lon, center.lat, center.lon);
            const specialty = typeConfig.label;

            return {
              name,
              specialty,
              address,
              lat: Number(center.lat),
              lon: Number(center.lon),
              distanceKm,
              phone: tags.phone || tags['contact:phone'],
              website: tags.website || tags['contact:website'],
              openingHours: tags.opening_hours || tags['opening_hours'],
            } satisfies HospitalResult;
          })
          .filter(Boolean) as HospitalResult[];

        const uniqueResults = mappedResults.filter(
          (item, index, array) => index === array.findIndex((candidate) => candidate.name === item.name && candidate.address === item.address)
        );

        const sorted = uniqueResults.sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 8);
        if (sorted.length > 0) {
          return sorted;
        }
      } catch (err) {
        console.error('OpenStreetMap search failed:', err);
        continue;
      }
    }

    return [];
  };

  const loadNearbyHospitals = async (lat: number, lon: number, fallbackLabel: string) => {
    setLoading(true);
    setError(null);
    setPermissionMessage(null);
    try {
      setLocationCoords({ lat, lon, label: fallbackLabel });
      setLocationLabel(fallbackLabel === 'your current location' ? `${lat.toFixed(4)}, ${lon.toFixed(4)}` : fallbackLabel);
      setLocationStatus('ready');

      const facilities = await fetchNearbyFacilities(lat, lon);
      const searchTarget = `${current.query} near ${fallbackLabel}`;

      if (facilities.length > 0) {
        setResults(facilities);
      } else {
        setResults([
          {
            name: `${current.label} nearby`,
            specialty: current.label,
            address: `Search ${searchTarget}`,
            lat,
            lon,
            distanceKm: 0,
            openingHours: 'Open Google Maps to view nearby options',
          },
        ]);
      }
      setSelectedHospital(null);
    } catch (err) {
      console.error('Nearby hospitals search failed:', err);
      setResults([]);
      setSelectedHospital(null);
      setError(err instanceof Error ? err.message : 'Unable to load nearby hospitals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const tryCurrentLocation = async () => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        const ipLocation = await getIpLocation();
        if (ipLocation) {
          await loadNearbyHospitals(ipLocation.lat, ipLocation.lon, ipLocation.label);
        } else {
          setLoading(false);
          setLocationStatus('blocked');
          setPermissionMessage('Your browser does not support geolocation. You can still search by city or location.');
        }
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await loadNearbyHospitals(position.coords.latitude, position.coords.longitude, `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        async (error) => {
          if (error.code === 1) {
            const ipLocation = await getIpLocation();
            if (ipLocation) {
              await loadNearbyHospitals(ipLocation.lat, ipLocation.lon, ipLocation.label);
              setLocationStatus('ready');
              setPermissionMessage('Location permission was denied, so we used your approximate network location instead.');
            } else {
              setLocationStatus('blocked');
              setPermissionMessage('Location permission was denied. You can search by city or location manually.');
              setLoading(false);
            }
          } else {
            const ipLocation = await getIpLocation();
            if (ipLocation) {
              await loadNearbyHospitals(ipLocation.lat, ipLocation.lon, ipLocation.label);
            } else {
              console.error('Geolocation error:', error);
              setError('Unable to access your location. Please try a manual search instead.');
              setLoading(false);
            }
          }
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    };

    void tryCurrentLocation();
  }, []);

  useEffect(() => {
    if (!locationCoords) return;
    void loadNearbyHospitals(locationCoords.lat, locationCoords.lon, locationCoords.label);
  }, [activeType]);

  const handleManualSearch = async () => {
    const query = manualQuery.trim();
    if (!query) {
      setError('Please enter a city, neighborhood, or address.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const geocoded = await geocodeLocation(query);
      await loadNearbyHospitals(geocoded.lat, geocoded.lon, geocoded.label);
    } catch (err) {
      console.error('Manual hospital search failed:', err);
      setError(err instanceof Error ? err.message : 'Unable to search that location.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <MapPin className="h-8 w-8 text-primary" /> Nearby Hospitals
        </h1>
        <p className="mt-1 text-muted-foreground">Find specialized care near you using your current location or a city search.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {hospitalTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveType(type.id)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
              activeType === type.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border/50 bg-card/40 text-muted-foreground hover:border-primary/30 hover:text-foreground'
            }`}
          >
            <type.icon className="h-4 w-4" />
            {type.label}
          </button>
        ))}
      </div>

      <Card className="glass p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={manualQuery}
              onChange={(e) => setManualQuery(e.target.value)}
              placeholder="Search by city, neighborhood, or address"
              className="pl-10"
            />
          </div>
          <Button onClick={handleManualSearch} className="gap-2">
            <Search className="h-4 w-4" /> Search location
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              if (typeof navigator === 'undefined' || !navigator.geolocation) {
                const ipLocation = await getIpLocation();
                if (ipLocation) {
                  await loadNearbyHospitals(ipLocation.lat, ipLocation.lon, ipLocation.label);
                  setPermissionMessage('Using your approximate network location.');
                } else {
                  setPermissionMessage('Your browser does not support geolocation.');
                }
                return;
              }

              navigator.geolocation.getCurrentPosition(
                async (position) => {
                  await loadNearbyHospitals(position.coords.latitude, position.coords.longitude, `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
                  setLocationStatus('ready');
                  setPermissionMessage('Using your current location.');
                },
                async () => {
                  const ipLocation = await getIpLocation();
                  if (ipLocation) {
                    await loadNearbyHospitals(ipLocation.lat, ipLocation.lon, ipLocation.label);
                    setLocationStatus('ready');
                  setPermissionMessage('Using your approximate network location instead.');
                  } else {
                    setLocationStatus('blocked');
                    setPermissionMessage('Location access was blocked. You can still search manually.');
                  }
                },
                { enableHighAccuracy: true, timeout: 10000 }
              );
            }}
          >
            Use current location
          </Button>
        </div>
        {permissionMessage ? (
          <p className="mt-3 text-sm text-muted-foreground">{permissionMessage}</p>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">We use your browser location when available. If access is denied, you can still search a city or address manually.</p>
        )}
      </Card>

      {loading ? (
        <Card className="glass p-8 text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Finding nearby hospitals and clinics...</p>
        </Card>
      ) : null}

      {error ? (
        <Card className="glass p-6 border-destructive/30">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        </Card>
      ) : null}

      {!loading && !error && results.length > 0 ? (
        <>
          <Card className="glass overflow-hidden p-0 animate-fade-in">
            <div className="border-b border-border/50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-secondary ${current.color}`}>
                  <current.icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-bold">{current.label}</h2>
                  <p className="text-xs text-muted-foreground">Results around {locationLabel}</p>
                </div>
              </div>
              <Button asChild size="sm" className="gap-1">
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                  <Navigation className="h-4 w-4" /> Open in Maps
                </a>
              </Button>
            </div>
            <div className="aspect-[16/10] w-full bg-muted">
              <iframe
                src={mapsUrl}
                title="Nearby Hospitals Map"
                className="h-full w-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            {results.map((item) => (
              <Card key={`${item.name}-${item.lat}-${item.lon}`} className="glass p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.address}</p>
                  </div>
                  <Badge className="text-xs">{item.distanceKm.toFixed(1)} km</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {item.phone ? <span>Phone: {item.phone}</span> : null}
                  {item.openingHours ? <span>Hours: {item.openingHours}</span> : <span>Hours: details vary by facility</span>}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedHospital(item)}>
                    View on map
                  </Button>
                  <Button asChild variant="secondary" size="sm" className="gap-1">
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lon}`} target="_blank" rel="noopener noreferrer">
                      <Navigation className="h-4 w-4" /> Directions
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : null}

      {!loading && !error && results.length === 0 ? (
        <Card className="glass p-8 text-center text-sm text-muted-foreground">
          No results were found for this search. Try another city or switch to a different care type.
        </Card>
      ) : null}

      <Card className="glass p-4">
        <p className="text-xs text-muted-foreground">
          Results are pulled from public mapping services and may vary by provider availability. Always call ahead to confirm services and hours.
        </p>
      </Card>
    </div>
  );
}
