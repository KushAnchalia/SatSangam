import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../App";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Calendar, MapPin, Users, Clock, DollarSign, Tag, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";

const EventDetailPage = ({ user }) => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await axiosInstance.get(`/events/${eventId}`);
      setEvent(response.data);
    } catch (error) {
      toast.error("Failed to load event");
      navigate("/events");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      toast.error("Please login to register");
      navigate("/auth");
      return;
    }

    setRegistering(true);

    try {
      // Create registration
      const regResponse = await axiosInstance.post("/registrations", {
        event_id: eventId,
      });

      // If paid event, initiate payment
      if (event.price > 0) {
        const originUrl = window.location.origin;
        const paymentResponse = await axiosInstance.post("/payments/checkout", {
          event_id: eventId,
          origin_url: originUrl,
        });

        // Redirect to Stripe checkout
        window.location.href = paymentResponse.data.url;
      } else {
        toast.success("Registration successful!");
        navigate("/my-events");
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(`/events/${eventId}`);
      toast.success("Event deleted successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to delete event");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const isHost = user?.id === event.host_id;
  const isFull = event.registered_count >= event.capacity;

  return (
    <div className="min-h-screen py-12 px-4" data-testid="event-detail-page">
      <div className="container mx-auto max-w-5xl">
        {/* Event Image */}
        <div
          className="w-full h-96 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 mb-8 relative overflow-hidden"
          style={{
            backgroundImage: event.cover_image ? `url(${event.cover_image})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          data-testid="event-cover-image"
        >
          {event.price > 0 && (
            <div className="absolute top-6 right-6 bg-primary text-primary-foreground px-4 py-2 rounded-full text-lg font-bold">
              ${event.price}
            </div>
          )}
          {event.price === 0 && (
            <div className="absolute top-6 right-6 bg-green-600 text-white px-4 py-2 rounded-full text-lg font-bold">
              Free Event
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-sm" data-testid="event-category">
                  {event.category}
                </Badge>
                <Badge variant="outline" className="text-sm" data-testid="event-type">
                  {event.event_type}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4 font-serif" data-testid="event-title">
                {event.title}
              </h1>
              <p className="text-lg text-muted-foreground" data-testid="event-host">
                Hosted by <span className="font-semibold text-foreground">{event.host_name}</span>
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4 font-serif">About</h2>
                <p className="text-muted-foreground whitespace-pre-wrap" data-testid="event-description">
                  {event.description}
                </p>
              </CardContent>
            </Card>

            {event.requirements && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4 font-serif">Requirements</h2>
                  <p className="text-muted-foreground" data-testid="event-requirements">{event.requirements}</p>
                </CardContent>
              </Card>
            )}

            {event.tags && event.tags.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold text-foreground font-serif">Tags</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-foreground">Date</p>
                    <p className="text-sm text-muted-foreground" data-testid="event-date">
                      {format(new Date(event.start_date), "PPP")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.start_date), "p")} - {format(new Date(event.end_date), "p")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-foreground">Location</p>
                    <p className="text-sm text-muted-foreground" data-testid="event-location">
                      {event.location || event.meeting_link || "Online"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-foreground">Capacity</p>
                    <p className="text-sm text-muted-foreground" data-testid="event-capacity">
                      {event.registered_count} / {event.capacity} registered
                    </p>
                  </div>
                </div>

                {event.price > 0 && (
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-foreground">Price</p>
                      <p className="text-sm text-muted-foreground" data-testid="event-price">
                        ${event.price}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            {isHost ? (
              <div className="space-y-3">
                <Link to={`/edit-event/${event.id}`} className="w-full">
                  <Button className="w-full btn-primary" data-testid="edit-event-button">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Event
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full" data-testid="delete-event-button">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Event
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the event.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                        {deleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <Button
                onClick={handleRegister}
                disabled={registering || isFull}
                className="w-full btn-primary"
                size="lg"
                data-testid="register-button"
              >
                {registering
                  ? "Processing..."
                  : isFull
                  ? "Event Full"
                  : event.price > 0
                  ? `Register - $${event.price}`
                  : "Register for Free"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
