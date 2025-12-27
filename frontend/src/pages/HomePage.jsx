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
    <div className="min-h-screen relative">
      {/* Floating Spiritual Emojis Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[5%] left-[5%] text-6xl animate-float" style={{animationDelay: '0s'}}>🧘</div>
        <div className="absolute top-[10%] right-[10%] text-5xl animate-float" style={{animationDelay: '0.5s'}}>🛕</div>
        <div className="absolute top-[20%] left-[80%] text-6xl animate-float" style={{animationDelay: '1s'}}>🌸</div>
        <div className="absolute top-[30%] left-[15%] text-5xl animate-float" style={{animationDelay: '1.5s'}}>🪔</div>
        <div className="absolute top-[40%] right-[20%] text-6xl animate-float" style={{animationDelay: '2s'}}>🕉️</div>
        <div className="absolute top-[50%] left-[10%] text-5xl animate-float" style={{animationDelay: '2.5s'}}>🎆</div>
        <div className="absolute top-[60%] right-[15%] text-6xl animate-float" style={{animationDelay: '3s'}}>🙏</div>
        <div className="absolute top-[70%] left-[25%] text-5xl animate-float" style={{animationDelay: '3.5s'}}>🛐</div>
        <div className="absolute bottom-[10%] right-[25%] text-6xl animate-float" style={{animationDelay: '4s'}}>ૐ</div>
        <div className="absolute bottom-[15%] left-[35%] text-5xl animate-float" style={{animationDelay: '4.5s'}}>🧿</div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="gradient-hero py-20 px-4">
          <div className="container mx-auto max-w-5xl text-center fade-in-up">
            <div className="flex justify-center mb-6 gap-4">
              <span className="text-6xl animate-bounce">🧘</span>
              <span className="text-6xl animate-bounce" style={{animationDelay: '0.2s'}}>🛕</span>
              <span className="text-6xl animate-bounce" style={{animationDelay: '0.4s'}}>🌸</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 font-serif">
              Discover Sacred
              <span className="text-gradient"> Gatherings</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              🪔 Connect with spiritual communities through satsangs, meditation sessions,
              and enlightening discourses. Find your path to inner peace. 🙏
            </p>
            <div className="bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-100 border-2 border-orange-300 rounded-xl p-4 max-w-3xl mx-auto mb-8">
              <p className="text-base text-orange-800 font-semibold text-center">
                ✨ <strong>Anyone can create and host events!</strong> Join as an attendee or create your own spiritual gathering. 🎉
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events">
                <Button size="lg" className="btn-primary" data-testid="explore-events-button">
                  <Calendar className="w-5 h-5 mr-2" />
                  🌸 Explore Events
                </Button>
              </Link>
              {user ? (
                <Link to="/create-event">
                  <Button size="lg" variant="outline" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700">
                    <Plus className="w-5 h-5 mr-2" />
                    🎊 Create Event
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" variant="outline" data-testid="get-started-button">
                    🕉️ Get Started
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
              <div className="flex justify-center gap-3 mb-4">
                <span className="text-4xl animate-pulse">🪔</span>
                <span className="text-4xl animate-pulse" style={{animationDelay: '0.3s'}}>🛕</span>
                <span className="text-4xl animate-pulse" style={{animationDelay: '0.6s'}}>🎆</span>
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-4 font-serif">
                Upcoming Satsangs
              </h2>
              <p className="text-muted-foreground">
                🙏 Join transformative spiritual gatherings near you 🌸
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="text-6xl animate-spin mb-4">🕉️</div>
                <p className="text-muted-foreground">Loading sacred events...</p>
              </div>
            ) : featuredEvents.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-8xl mb-4">🛕</div>
                <p className="text-muted-foreground">No events available yet</p>
                <p className="text-muted-foreground mt-2">🪔 Be the first to create a sacred gathering!</p>
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
                    <Card className="event-card h-full hover:shadow-lg transition-shadow border-border/50 relative overflow-hidden">
                      {/* Floating emoji on card */}
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
                        <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          🎉 Free
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

            {featuredEvents.length > 0 && (
              <div className="text-center mt-12">
                <Link to="/events">
                  <Button variant="outline" size="lg" data-testid="view-all-events-button">
                    🌸 View All Events
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-primary/5 relative overflow-hidden">
          {/* Background decorative emojis */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
            <div className="absolute top-10 left-10 text-8xl animate-float">🛕</div>
            <div className="absolute top-10 right-10 text-8xl animate-float" style={{animationDelay: '1s'}}>🪔</div>
            <div className="absolute bottom-10 left-20 text-8xl animate-float" style={{animationDelay: '2s'}}>🌸</div>
            <div className="absolute bottom-10 right-20 text-8xl animate-float" style={{animationDelay: '3s'}}>🛐</div>
          </div>
          
          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <div className="text-7xl mb-6 animate-bounce">🕉️</div>
            <h2 className="text-4xl font-bold text-foreground mb-6 font-serif">
              Host Your Own Satsang
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              🪔 Share your spiritual wisdom and create meaningful connections.
              Start organizing your gatherings today. 🙏
            </p>
            {!user && (
              <Link to="/auth">
                <Button size="lg" className="btn-primary" data-testid="become-host-button">
                  🌸 Become a Host
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
            {user && (
              <Link to="/create-event">
                <Button size="lg" className="btn-primary" data-testid="create-first-event-button">
                  <Sparkles className="w-5 h-5 mr-2" />
                  🪔 Create Your First Event
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </section>
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

export default HomePage;
