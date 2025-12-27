import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../App";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Calendar, MapPin, Users, Sparkles, ArrowRight } from "lucide-react";
import { format } from "date-fns";

const HomePage = ({ user }) => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      const response = await axiosInstance.get("/events?status=published");
      setFeaturedEvents(response.data.slice(0, 6));
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero py-20 px-4">
        <div className="container mx-auto max-w-5xl text-center fade-in-up">
          <div className="flex justify-center mb-6">
            <Sparkles className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 font-serif">
            Discover Sacred
            <span className="text-gradient"> Gatherings</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect with spiritual communities through satsangs, meditation sessions,
            and enlightening discourses. Find your path to inner peace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events">
              <Button size="lg" className="btn-primary" data-testid="explore-events-button">
                <Calendar className="w-5 h-5 mr-2" />
                Explore Events
              </Button>
            </Link>
            {!user && (
              <Link to="/auth">
                <Button size="lg" variant="outline" data-testid="get-started-button">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 px-4" data-testid="featured-events-section">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-serif">
              Upcoming Satsangs
            </h2>
            <p className="text-muted-foreground">
              Join transformative spiritual gatherings near you
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : featuredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event, index) => (
                <Link
                  to={`/events/${event.id}`}
                  key={event.id}
                  className={`fade-in-up stagger-${(index % 4) + 1}`}
                  data-testid={`event-card-${event.id}`}
                >
                  <Card className="event-card h-full hover:shadow-lg transition-shadow border-border/50">
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
                      {event.price > 0 && (
                        <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                          ${event.price}
                        </div>
                      )}
                      {event.price === 0 && (
                        <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Free
                        </div>
                      )}
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

          {featuredEvents.length > 0 && (
            <div className="text-center mt-12">
              <Link to="/events">
                <Button variant="outline" size="lg" data-testid="view-all-events-button">
                  View All Events
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6 font-serif">
            Host Your Own Satsang
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Share your spiritual wisdom and create meaningful connections.
            Start organizing your gatherings today.
          </p>
          {!user && (
            <Link to="/auth">
              <Button size="lg" className="btn-primary" data-testid="become-host-button">
                Become a Host
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          )}
          {user && user.is_host && (
            <Link to="/create-event">
              <Button size="lg" className="btn-primary" data-testid="create-first-event-button">
                <Sparkles className="w-5 h-5 mr-2" />
                Create Your First Event
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          )}
          {user && !user.is_host && (
            <p className="text-muted-foreground">
              Join as a host when signing up to start creating events!
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
