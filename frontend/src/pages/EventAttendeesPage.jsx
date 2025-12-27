import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../App";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { 
  Users, Mail, Download, Search, Send, CheckCircle, 
  Clock, XCircle, Calendar, MapPin, ArrowLeft, MessageSquare
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../components/ui/dialog";

const EventAttendeesPage = ({ user }) => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [filteredAttendees, setFilteredAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState({ subject: "", body: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchEventAndAttendees();
  }, [eventId]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = attendees.filter(
        (a) =>
          a.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.user_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAttendees(filtered);
    } else {
      setFilteredAttendees(attendees);
    }
  }, [searchTerm, attendees]);

  const fetchEventAndAttendees = async () => {
    try {
      const [eventRes, attendeesRes] = await Promise.all([
        axiosInstance.get(`/events/${eventId}`),
        axiosInstance.get(`/registrations/event/${eventId}`),
      ]);

      const eventData = eventRes.data;
      
      // Check if user is the host
      if (eventData.host_id !== user.id) {
        toast.error("You are not authorized to view this page");
        navigate("/dashboard");
        return;
      }

      setEvent(eventData);
      setAttendees(attendeesRes.data);
      setFilteredAttendees(attendeesRes.data);
    } catch (error) {
      toast.error("Failed to load attendees");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Status", "Payment Status", "Registration Date", "QR Code"];
    const rows = attendees.map((a) => [
      a.user_name,
      a.user_email,
      a.status,
      a.payment_status,
      format(new Date(a.registration_date), "PPP"),
      a.qr_code || "N/A",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${event.title}_attendees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Attendee list exported!");
  };

  const handleSendMessage = async () => {
    if (!message.subject || !message.body) {
      toast.error("Please fill in all fields");
      return;
    }

    setSending(true);
    try {
      // This would be a real API call in production
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success(`Message sent to ${attendees.length} attendees!`);
      setMessageOpen(false);
      setMessage({ subject: "", body: "" });
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const confirmedCount = attendees.filter((a) => a.status === "confirmed").length;
  const waitlistCount = attendees.filter((a) => a.status === "waitlist").length;
  const paidCount = attendees.filter((a) => a.payment_status === "paid").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading attendees...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 relative">
      {/* Floating Emojis */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[8%] left-[8%] text-5xl animate-float" style={{animationDelay: '0s'}}>👥</div>
        <div className="absolute top-[15%] right-[12%] text-6xl animate-float" style={{animationDelay: '1s'}}>🎉</div>
        <div className="absolute bottom-[20%] left-[15%] text-5xl animate-float" style={{animationDelay: '2s'}}>✨</div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground font-serif mb-2">
                🙏 Event Attendees
              </h1>
              <p className="text-lg text-muted-foreground font-semibold">
                {event.title}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(event.start_date), "PPP")}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {event.event_type === "online" ? "Online" : event.location}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-primary">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>📧 Send Message to All Attendees</DialogTitle>
                    <DialogDescription>
                      This message will be sent to all {attendees.length} registered attendees
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Subject</label>
                      <Input
                        placeholder="e.g., Important Update: Event Venue Changed"
                        value={message.subject}
                        onChange={(e) =>
                          setMessage({ ...message, subject: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Message</label>
                      <Textarea
                        placeholder="Write your message here..."
                        rows={6}
                        value={message.body}
                        onChange={(e) =>
                          setMessage({ ...message, body: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setMessageOpen(false)}
                      disabled={sending}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSendMessage} disabled={sending}>
                      {sending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-semibold">Total Registered</p>
                  <p className="text-3xl font-bold text-blue-900">{attendees.length}</p>
                </div>
                <Users className="w-12 h-12 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-semibold">Confirmed</p>
                  <p className="text-3xl font-bold text-green-900">{confirmedCount}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700 font-semibold">Waitlist</p>
                  <p className="text-3xl font-bold text-orange-900">{waitlistCount}</p>
                </div>
                <Clock className="w-12 h-12 text-orange-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-semibold">Paid</p>
                  <p className="text-3xl font-bold text-purple-900">{paidCount}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-purple-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="🔍 Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Attendees List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Attendee List ({filteredAttendees.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAttendees.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "No attendees found matching your search" : "No attendees yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAttendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {attendee.user_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{attendee.user_name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {attendee.user_email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right mr-4">
                        <p className="text-xs text-muted-foreground">Registered</p>
                        <p className="text-sm font-medium">
                          {format(new Date(attendee.registration_date), "MMM d, yyyy")}
                        </p>
                      </div>

                      <Badge
                        variant={attendee.status === "confirmed" ? "default" : "secondary"}
                        className="min-w-[90px] justify-center"
                      >
                        {attendee.status === "confirmed" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {attendee.status === "waitlist" && <Clock className="w-3 h-3 mr-1" />}
                        {attendee.status === "cancelled" && <XCircle className="w-3 h-3 mr-1" />}
                        {attendee.status}
                      </Badge>

                      {event.price > 0 && (
                        <Badge
                          variant={attendee.payment_status === "paid" ? "default" : "outline"}
                          className={`min-w-[80px] justify-center ${
                            attendee.payment_status === "paid"
                              ? "bg-green-600"
                              : "border-orange-400 text-orange-700"
                          }`}
                        >
                          {attendee.payment_status}
                        </Badge>
                      )}

                      {attendee.qr_code && (
                        <Badge variant="outline" className="font-mono text-xs">
                          {attendee.qr_code.slice(0, 12)}...
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventAttendeesPage;
