import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/context/SupabaseDataContext";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
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

  const hasResults = searchResults.cars.length > 0 || searchResults.clients.length > 0 || searchResults.bookings.length > 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search cars, clients, bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
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
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-80 p-0 bg-white border-gray-200 shadow-lg" 
        align="start"
      >
        <Command className="bg-white">
          <CommandList className="max-h-80">
            {!hasResults && searchTerm && (
              <CommandEmpty className="py-6 text-center text-gray-500">
                No results found for "{searchTerm}"
              </CommandEmpty>
            )}
            
            {searchResults.cars.length > 0 && (
              <CommandGroup heading="Cars">
                {searchResults.cars.map((car) => (
                  <CommandItem
                    key={car.id}
                    onSelect={() => handleResultClick('car', car.id)}
                    className="flex items-center gap-3 p-3 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-xs">C</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{car.name}</p>
                      <p className="text-sm text-gray-500 truncate">{car.model} • {car.year}</p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            
            {searchResults.clients.length > 0 && (
              <CommandGroup heading="Clients">
                {searchResults.clients.map((client) => (
                  <CommandItem
                    key={client.id}
                    onSelect={() => handleResultClick('client', client.id)}
                    className="flex items-center gap-3 p-3 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-xs">U</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{client.name}</p>
                      <p className="text-sm text-gray-500 truncate">{client.email}</p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            
            {searchResults.bookings.length > 0 && (
              <CommandGroup heading="Bookings">
                {searchResults.bookings.map((booking) => (
                  <CommandItem
                    key={booking.id}
                    onSelect={() => handleResultClick('booking', booking.id)}
                    className="flex items-center gap-3 p-3 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-xs">B</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{booking.client.name}</p>
                      <p className="text-sm text-gray-500 truncate">{booking.car} • {booking.status}</p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}