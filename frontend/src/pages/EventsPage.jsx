import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../App";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Calendar, MapPin, Users, Search } from "lucide-react";
import { format } from "date-fns";

const EventsPage = ({ user }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    fetchEvents();
  }, [searchTerm, categoryFilter, typeFilter]);

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (categoryFilter) params.append("category", categoryFilter);
      if (typeFilter) params.append("event_type", typeFilter);
      params.append("status", "published");

      const response = await axiosInstance.get(`/events?${params.toString()}`);
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div className="min-h-screen py-12 px-4 relative" data-testid="events-page">
      {/* Floating Spiritual Emojis */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[8%] left-[8%] text-5xl animate-float" style={{animationDelay: '0s'}}>🛕</div>
        <div className="absolute top-[15%] right-[12%] text-6xl animate-float" style={{animationDelay: '1s'}}>🪔</div>
        <div className="absolute top-[35%] left-[5%] text-5xl animate-float" style={{animationDelay: '2s'}}>🌸</div>
        <div className="absolute top-[55%] right-[8%] text-6xl animate-float" style={{animationDelay: '3s'}}>🙏</div>
        <div className="absolute bottom-[15%] left-[15%] text-5xl animate-float" style={{animationDelay: '4s'}}>🛐</div>
        <div className="absolute bottom-[20%] right-[20%] text-6xl animate-float" style={{animationDelay: '5s'}}>🎆</div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="mb-8 text-center">
          <div className="flex justify-center gap-3 mb-4">
            <span className="text-5xl animate-bounce">🕉️</span>
            <span className="text-5xl animate-bounce" style={{animationDelay: '0.2s'}}>🌸</span>
            <span className="text-5xl animate-bounce" style={{animationDelay: '0.4s'}}>🪔</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4 font-serif">
            Explore Sacred Events
          </h1>
          <p className="text-muted-foreground">🙏 Find your next spiritual gathering 🌸</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4" data-testid="search-filters">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="🔍 Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="search-input"
              />
            </div>
            <Button type="submit" className="btn-primary" data-testid="search-button">
              🌸 Search
            </Button>
          </form>

          <div className="flex flex-wrap gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]" data-testid="category-filter">
                <SelectValue placeholder="🧘 Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Categories</SelectItem>
                <SelectItem value="meditation">🧘 Meditation</SelectItem>
                <SelectItem value="discourse">📚 Discourse</SelectItem>
                <SelectItem value="bhajan">🎶 Bhajan</SelectItem>
                <SelectItem value="karma-yoga">🙏 Karma Yoga</SelectItem>
                <SelectItem value="workshop">✨ Workshop</SelectItem>
                <SelectItem value="retreat">🌿 Retreat</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]" data-testid="type-filter">
                <SelectValue placeholder="🌍 Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Types</SelectItem>
                <SelectItem value="in-person">🏛️ In-Person</SelectItem>
                <SelectItem value="online">💻 Online</SelectItem>
                <SelectItem value="hybrid">🌐 Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-7xl animate-spin mb-4">🕉️</div>
            <p className="text-muted-foreground">Loading sacred events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-8xl mb-4">🛕</div>
            <p className="text-muted-foreground mb-2">No events found</p>
            <p className="text-sm text-muted-foreground">🪔 Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="events-grid">
            {events.map((event) => (
              <Link to={`/events/${event.id}`} key={event.id} data-testid={`event-card-${event.id}`}>
                <Card className="event-card h-full hover:shadow-lg transition-shadow border-border/50 relative overflow-hidden">
                  {/* Category Emoji */}
                  <div className="absolute top-2 left-2 text-3xl animate-pulse z-10">
                    {event.category === 'meditation' && '🧘'}
                    {event.category === 'discourse' && '📚'}
                    {event.category === 'bhajan' && '🎶'}
                    {event.category === 'karma-yoga' && '🙏'}
                    {event.category === 'workshop' && '✨'}
                    {event.category === 'retreat' && '🌿'}
                  </div>
                  <div
                    className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden"
                    style={{
                      backgroundImage: event.cover_image
                        ? `url(${event.cover_image})`
                        : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      🎉 Free
                    </div>
                    <div className="absolute top-3 left-3 bg-background/90 backdrop-blur px-2 py-1 rounded text-xs font-medium">
                      {event.event_type === 'online' && '💻 Online'}
                      {event.event_type === 'in-person' && '🏛️ In-Person'}
                      {event.event_type === 'hybrid' && '🌐 Hybrid'}
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        {event.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 font-serif line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{format(new Date(event.start_date), "PPP")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="line-clamp-1">
                          {event.location || event.meeting_link || "Online"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span>
                          {event.registered_count}/{event.capacity} registered
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-30px) rotate(5deg);
            opacity: 0.6;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EventsPage;
