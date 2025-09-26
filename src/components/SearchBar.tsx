import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useData } from "@/context/SupabaseDataContext";
import { Car, Client, CalendarDays, Users } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'car' | 'client' | 'booking';
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { cars, clients, bookings } = useData();

  // Search function
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const searchResults: SearchResult[] = [];

    // Search cars
    cars.forEach(car => {
      if (
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.category.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        searchResults.push({
          id: car.id,
          title: `${car.name} ${car.model}`,
          subtitle: `${car.category} • ${car.status}`,
          type: 'car',
          url: `/cars/${car.id}`,
          icon: Car
        });
      }
    });

    // Search clients
    clients.forEach(client => {
      if (
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        searchResults.push({
          id: client.id,
          title: client.name,
          subtitle: client.email,
          type: 'client',
          url: `/clients/${client.id}`,
          icon: Users
        });
      }
    });

    // Search bookings
    bookings.forEach(booking => {
      const car = cars.find(c => c.id === booking.carId);
      const client = clients.find(c => c.id === booking.clientId);
      
      if (
        (car && (car.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 car.model.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (client && client.name.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        searchResults.push({
          id: booking.id,
          title: `Booking #${booking.id.slice(0, 8)}`,
          subtitle: `${car?.name || 'Unknown Car'} • ${client?.name || 'Unknown Client'}`,
          type: 'booking',
          url: `/bookings/${booking.id}`,
          icon: CalendarDays
        });
      }
    });

    setResults(searchResults.slice(0, 10)); // Limit to 10 results
  };

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    performSearch(value);
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open search when typing
  useEffect(() => {
    if (query.trim()) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [query]);

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search cars, clients, bookings..."
          value={query}
          onChange={handleSearch}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 w-80"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Search Results */}
      {isOpen && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            <div className="space-y-1">
              {results.map((result) => {
                const IconComponent = result.icon;
                return (
                  <div
                    key={`${result.type}-${result.id}`}
                    className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{result.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {result.type}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {isOpen && query.trim() && results.length === 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50">
          <CardContent className="p-4 text-center">
            <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}