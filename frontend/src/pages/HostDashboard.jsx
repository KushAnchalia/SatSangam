import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../App";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Calendar, MapPin, Users, Edit, Eye, Plus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const HostDashboard = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const response = await axiosInstance.get("/events/host/my-events");
      setEvents(response.data);
    } catch (error) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async (eventId) => {
    setLoadingRegistrations(true);
    try {
      const response = await axiosInstance.get(`/registrations/event/${eventId}`);
      setRegistrations(response.data);
      setSelectedEvent(events.find((e) => e.id === eventId));
    } catch (error) {
      toast.error("Failed to load registrations");
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const upcomingEvents = events.filter((e) => new Date(e.start_date) > new Date());
  const pastEvents = events.filter((e) => new Date(e.start_date) <= new Date());

  return (
    <div className="min-h-screen py-12 px-4" data-testid="host-dashboard">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground font-serif">Host Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your events and registrations</p>
          </div>
          <Link to="/create-event">
            <Button className="btn-primary" data-testid="create-new-event-button">
              <Plus className="w-5 h-5 mr-2" />
              Create Event
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="events" data-testid="events-tab">My Events</TabsTrigger>
            <TabsTrigger value="registrations" data-testid="registrations-tab">
              Registrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">You haven't created any events yet</p>
                  <Link to="/create-event">
                    <Button className="btn-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Event
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {upcomingEvents.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4 font-serif">
                      Upcoming Events
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {upcomingEvents.map((event) => (
                        <Card key={event.id} className="event-card" data-testid={`event-card-${event.id}`}>
                          <div
                            className="h-32 bg-gradient-to-br from-primary/20 to-accent/20"
                            style={{
                              backgroundImage: event.cover_image
                                ? `url(${event.cover_image})`
                                : undefined,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                          <CardContent className="p-4">
                            <Badge variant="secondary" className="mb-2">
                              {event.category}
                            </Badge>
                            <h3 className="text-lg font-bold text-foreground mb-2 font-serif line-clamp-1">
                              {event.title}
                            </h3>
                            <div className="space-y-1 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{format(new Date(event.start_date), "PPP")}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>
                                  {event.registered_count}/{event.capacity}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Link to={`/events/${event.id}`} className="flex-1">
                                <Button variant="outline" size="sm" className="w-full">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Button>
                              </Link>
                              <Link to={`/edit-event/${event.id}`} className="flex-1">
                                <Button size="sm" className="w-full btn-primary">
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {pastEvents.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4 font-serif">Past Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pastEvents.map((event) => (
                        <Card key={event.id} className="opacity-75" data-testid={`past-event-card-${event.id}`}>
                          <div
                            className="h-32 bg-gradient-to-br from-primary/20 to-accent/20"
                            style={{
                              backgroundImage: event.cover_image
                                ? `url(${event.cover_image})`
                                : undefined,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                          <CardContent className="p-4">
                            <Badge variant="secondary" className="mb-2">
                              {event.category}
                            </Badge>
                            <h3 className="text-lg font-bold text-foreground mb-2 font-serif line-clamp-1">
                              {event.title}
                            </h3>
                            <div className="space-y-1 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{format(new Date(event.start_date), "PPP")}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>
                                  {event.registered_count}/{event.capacity}
                                </span>
                              </div>
                            </div>
                            <Link to={`/events/${event.id}`}>
                              <Button variant="outline" size="sm" className="w-full">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="registrations">
            <Card>
              <CardHeader>
                <CardTitle>Event Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                {events.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Create an event to see registrations
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Select Event</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        onChange={(e) => fetchRegistrations(e.target.value)}
                        defaultValue=""
                        data-testid="event-select"
                      >
                        <option value="" disabled>
                          Choose an event...
                        </option>
                        {events.map((event) => (
                          <option key={event.id} value={event.id}>
                            {event.title} ({event.registered_count} registered)
                          </option>
                        ))}
                      </select>
                    </div>

                    {loadingRegistrations && (
                      <p className="text-center text-muted-foreground py-8">Loading...</p>
                    )}

                    {selectedEvent && !loadingRegistrations && (
                      <div className="mt-6">
                        <h3 className="text-lg font-bold mb-4">
                          Registrations for {selectedEvent.title}
                        </h3>
                        {registrations.length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">
                            No registrations yet
                          </p>
                        ) : (
                          <div className="space-y-2" data-testid="registrations-list">
                            {registrations.map((reg) => (
                              <div
                                key={reg.id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                                data-testid={`registration-${reg.id}`}
                              >
                                <div>
                                  <p className="font-medium">{reg.user_name}</p>
                                  <p className="text-sm text-muted-foreground">{reg.user_email}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Registered: {format(new Date(reg.registration_date), "PPP")}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={reg.status === "confirmed" ? "default" : "secondary"}
                                  >
                                    {reg.status}
                                  </Badge>
                                  <Badge
                                    variant={
                                      reg.payment_status === "paid" ? "default" : "secondary"
                                    }
                                  >
                                    {reg.payment_status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HostDashboard;
