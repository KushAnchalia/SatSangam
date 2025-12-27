import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../App";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Calendar, MapPin, Ticket, Download, QrCode, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

const MyRegistrations = ({ user }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQR, setSelectedQR] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegistrations();
    
    // Check if redirected from QR code scan
    const approved = searchParams.get('approved');
    const eventId = searchParams.get('eventId');
    if (approved === 'true' && eventId) {
      toast.success("✅ You are approved! Welcome to the event!", {
        duration: 5000,
      });
      // Clean up URL
      navigate('/my-events', { replace: true });
    }
  }, [searchParams, navigate]);

  const fetchRegistrations = async () => {
    try {
      const response = await axiosInstance.get("/registrations/my-registrations");
      setRegistrations(response.data);
    } catch (error) {
      toast.error("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  const upcomingRegistrations = registrations.filter(
    (r) => new Date(r.event_start_date) > new Date()
  );
  const pastRegistrations = registrations.filter(
    (r) => new Date(r.event_start_date) <= new Date()
  );

  const handleViewQR = (reg) => {
    setSelectedQR(reg);
  };

  const handleDownloadQR = (reg) => {
    const canvas = document.getElementById(`qr-${reg.id}`);
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${reg.event_title}-ticket.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success("QR Code downloaded!");
    }
  };

  const generateQRValue = (reg) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/events/${reg.event_id}?ticket=${reg.id}&approved=true`;
  };

  return (
    <div className="min-h-screen py-12 px-4" data-testid="my-registrations-page">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground font-serif">My Events</h1>
          <p className="text-muted-foreground mt-2">Your registered satsangs and gatherings</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : registrations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">You haven't registered for any events yet</p>
              <Link to="/events">
                <Button className="btn-primary">Explore Events</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {upcomingRegistrations.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-serif">
                  Upcoming Events
                </h2>
                <div className="space-y-4" data-testid="upcoming-registrations">
                  {upcomingRegistrations.map((reg) => (
                    <Card key={reg.id} className="event-card hover:shadow-lg transition-shadow" data-testid={`registration-${reg.id}`}>
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <div
                            className="w-32 h-32 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex-shrink-0"
                            style={{
                              backgroundImage: reg.event_cover_image
                                ? `url(${reg.event_cover_image})`
                                : undefined,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <Link to={`/events/${reg.event_id}`}>
                                <h3 className="text-xl font-bold text-foreground font-serif hover:text-orange-600 transition-colors">
                                  {reg.event_title}
                                </h3>
                              </Link>
                              <div className="flex gap-2">
                                <Badge
                                  variant={reg.status === "confirmed" ? "default" : "secondary"}
                                >
                                  {reg.status}
                                </Badge>
                                {reg.payment_status === "paid" && (
                                  <Badge className="bg-green-600">Paid</Badge>
                                )}
                                {reg.payment_status === "pending" && (
                                  <Badge variant="outline">Payment Pending</Badge>
                                )}
                              </div>
                            </div>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span>{format(new Date(reg.event_start_date), "PPPp")}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span className="text-green-600 font-semibold">✅ You're approved to attend!</span>
                              </div>
                              <p className="text-xs mt-2">
                                Registered: {format(new Date(reg.registration_date), "PPP")}
                              </p>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleViewQR(reg);
                                }}
                                className="btn-primary"
                                size="sm"
                              >
                                <QrCode className="w-4 h-4 mr-2" />
                                View QR Ticket
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDownloadQR(reg);
                                }}
                                variant="outline"
                                size="sm"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {pastRegistrations.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 font-serif">Past Events</h2>
                <div className="space-y-4" data-testid="past-registrations">
                  {pastRegistrations.map((reg) => (
                    <Link to={`/events/${reg.event_id}`} key={reg.id}>
                      <Card className="opacity-75 hover:opacity-100 transition-opacity">
                        <CardContent className="p-6">
                          <div className="flex gap-6">
                            <div
                              className="w-32 h-32 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex-shrink-0"
                              style={{
                                backgroundImage: reg.event_cover_image
                                  ? `url(${reg.event_cover_image})`
                                  : undefined,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            />
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-foreground font-serif mb-2">
                                {reg.event_title}
                              </h3>
                              <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-primary" />
                                  <span>{format(new Date(reg.event_start_date), "PPPp")}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRegistrations;
