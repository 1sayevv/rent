import { useState, useMemo, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, Car, Users, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/context/SupabaseDataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { cars, clients, bookings } = useData();

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return { cars: [], clients: [], bookings: [] };

    const term = searchTerm.toLowerCase();
    
    const filteredCars = cars.filter(car => 
      car.name.toLowerCase().includes(term) || 
      car.model.toLowerCase().includes(term)
    ).slice(0, 3);

    const filteredClients = clients.filter(client => 
      client.name.toLowerCase().includes(term) || 
      client.email.toLowerCase().includes(term)
    ).slice(0, 3);

    const filteredBookings = bookings.filter(booking => 
      booking.client.name.toLowerCase().includes(term) || 
      booking.car.toLowerCase().includes(term)
    ).slice(0, 3);

    return { cars: filteredCars, clients: filteredClients, bookings: filteredBookings };
  }, [searchTerm, cars, clients, bookings]);

  const handleResultClick = (type: string, id: string) => {
    setIsOpen(false);
    setSearchTerm("");
    
    switch (type) {
      case 'car':
        navigate(`/cars/${id}`);
        break;
      case 'client':
        navigate(`/clients/${id}`);
        break;
      case 'booking':
        navigate(`/bookings`);
        break;
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsOpen(false);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open search when typing
  useEffect(() => {
    if (searchTerm.trim()) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchTerm]);

  const hasResults = searchResults.cars.length > 0 || searchResults.clients.length > 0 || searchResults.bookings.length > 0;

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search cars, clients, bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 w-80"
          onFocus={() => setIsOpen(true)}
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {isOpen && hasResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto bg-white border-gray-200 shadow-lg">
          <CardContent className="p-0">
            <div className="space-y-1">
              {searchResults.cars.length > 0 && (
                <div className="p-2 border-b border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Cars</h4>
                  {searchResults.cars.map((car) => (
                    <div
                      key={car.id}
                      className="flex items-center gap-3 p-3 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 cursor-pointer rounded-lg"
                      onClick={() => handleResultClick('car', car.id)}
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Car className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{car.name}</p>
                        <p className="text-sm text-gray-500 truncate">{car.model} • {car.year}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {car.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
              
              {searchResults.clients.length > 0 && (
                <div className="p-2 border-b border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Clients</h4>
                  {searchResults.clients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center gap-3 p-3 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 cursor-pointer rounded-lg"
                      onClick={() => handleResultClick('client', client.id)}
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{client.name}</p>
                        <p className="text-sm text-gray-500 truncate">{client.email}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {client.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
              
              {searchResults.bookings.length > 0 && (
                <div className="p-2">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Bookings</h4>
                  {searchResults.bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center gap-3 p-3 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 cursor-pointer rounded-lg"
                      onClick={() => handleResultClick('booking', booking.id)}
                    >
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{booking.client.name}</p>
                        <p className="text-sm text-gray-500 truncate">{booking.car} • {booking.status}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {isOpen && searchTerm.trim() && !hasResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border-gray-200 shadow-lg">
          <CardContent className="p-4 text-center">
            <Search className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No results found for "{searchTerm}"</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}