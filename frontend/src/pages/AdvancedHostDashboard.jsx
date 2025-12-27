import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../App";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import {
  Calendar, Users, Settings, Plus, Eye, Edit, Trash2, Download, Search, Filter,
  Bell, BarChart3, MapPin, Clock, DollarSign, UserPlus, Shield, TrendingUp,
  Activity, CheckCircle2
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const AdvancedHostDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalAttendees: 0,
    revenue: "₹0"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [eventsRes, regsRes] = await Promise.all([
        axiosInstance.get("/events/host/my-events"),
        axiosInstance.get("/registrations/my-registrations")
      ]);

      const eventsData = eventsRes.data;
      setEvents(eventsData);

      const now = new Date();
      const activeEventsCount = eventsData.filter(e => new Date(e.start_date) > now).length;
      const totalAttendees = eventsData.reduce((sum, e) => sum + e.registered_count, 0);

      setStats({
        totalEvents: eventsData.length,
        activeEvents: activeEventsCount,
        totalAttendees: totalAttendees,
        revenue: "₹0" // Can be calculated if you have pricing data
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventRegistrations = async (eventId) => {
    try {
      const response = await axiosInstance.get(`/registrations/event/${eventId}`);
      setRegistrations(response.data);
    } catch (error) {
      toast.error("Failed to load registrations");
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "meditation",
    event_type: "in-person",
    location: "",
    meeting_link: "",
    start_date: "",
    end_date: "",
    capacity: 50,
    price: 0,
    cover_image: "",
    requirements: "",
    tags: ""
  });

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity)
      };

      await axiosInstance.post("/events", payload);
      toast.success("Event created successfully!");
      setShowCreateEvent(false);
      fetchDashboardData();
      setFormData({
        title: "",
        description: "",
        category: "meditation",
        event_type: "in-person",
        location: "",
        meeting_link: "",
        start_date: "",
        end_date: "",
        capacity: 50,
        price: 0,
        cover_image: "",
        requirements: "",
        tags: ""
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to create event");
    }
  };

  const upcomingEvents = events.filter(e => new Date(e.start_date) > new Date());
  const pastEvents = events.filter(e => new Date(e.start_date) <= new Date());

  return (
    <div className="min-h-screen relative" data-testid="advanced-host-dashboard">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-300 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-300 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-300 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Enhanced Header */}
        <header className="bg-white/80 backdrop-blur-md border-b-2 border-orange-200 shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🕉️</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-700 bg-clip-text text-transparent font-serif">
                    Satsang Admin
                  </h1>
                  <p className="text-sm text-orange-700/70">Manage Your Sacred Gatherings</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-orange-600 hover:bg-orange-100 rounded-full transition-all">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800" data-testid="dashboard-user-name">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {user.name.charAt(0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          {/* Navigation Tabs */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-orange-200 mb-8 p-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 w-full gap-2 bg-transparent">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 rounded-xl"
                  data-testid="overview-tab"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 rounded-xl"
                  data-testid="events-tab"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Events
                </TabsTrigger>
                <TabsTrigger
                  value="registrations"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 rounded-xl"
                  data-testid="registrations-tab"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Registrations
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 rounded-xl"
                >
                  <Activity className="w-5 h-5 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 rounded-xl"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8 mt-8 animate-fade-in">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: "Total Events", value: stats.totalEvents, icon: Calendar, color: "from-orange-500 to-amber-600", bgColor: "bg-orange-100" },
                    { label: "Active Events", value: stats.activeEvents, icon: Clock, color: "from-pink-500 to-rose-600", bgColor: "bg-pink-100" },
                    { label: "Total Attendees", value: stats.totalAttendees, icon: Users, color: "from-amber-500 to-yellow-600", bgColor: "bg-amber-100" },
                    { label: "Growth", value: "+12%", icon: TrendingUp, color: "from-green-500 to-emerald-600", bgColor: "bg-green-100" }
                  ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <Card
                        key={idx}
                        className="bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-orange-200"
                        style={{animationDelay: `${idx * 0.1}s`}}
                        data-testid={`stat-card-${idx}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                              <Icon className="w-6 h-6 text-orange-600" />
                            </div>
                            <Badge className={`bg-gradient-to-r ${stat.color} text-white`}>+12%</Badge>
                          </div>
                          <h3 className="text-3xl font-bold text-gray-800 mb-1 font-serif">{stat.value}</h3>
                          <p className="text-sm text-gray-600">{stat.label}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Quick Actions */}
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 font-serif">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <button
                        onClick={() => setShowCreateEvent(true)}
                        className="bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 rounded-xl p-6 border-2 border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg hover:scale-105 group"
                        data-testid="quick-create-event"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform">
                          <Plus className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700 text-center">Create Event</p>
                      </button>
                      <button
                        onClick={() => setActiveTab("events")}
                        className="bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 rounded-xl p-6 border-2 border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg hover:scale-105 group"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700 text-center">View Events</p>
                      </button>
                      <button
                        onClick={() => setActiveTab("registrations")}
                        className="bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 rounded-xl p-6 border-2 border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg hover:scale-105 group"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700 text-center">Registrations</p>
                      </button>
                      <button
                        onClick={() => setActiveTab("analytics")}
                        className="bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 rounded-xl p-6 border-2 border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg hover:scale-105 group"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform">
                          <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700 text-center">Analytics</p>
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Events */}
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 font-serif">Recent Events</h2>
                    {upcomingEvents.slice(0, 3).length > 0 ? (
                      <div className="space-y-4">
                        {upcomingEvents.slice(0, 3).map(event => (
                          <div key={event.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-orange-50 transition-colors">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-800">{event.title}</h3>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4 text-orange-500" />
                                  {format(new Date(event.start_date), "PPP")}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4 text-orange-500" />
                                  {event.registered_count}/{event.capacity}
                                </div>
                              </div>
                            </div>
                            <Link to={`/events/${event.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">No upcoming events</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Events Tab - Showing existing events */}
              <TabsContent value="events" className="space-y-6 mt-8 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 font-serif">Event Management</h2>
                    <p className="text-gray-600 mt-1">Create, edit, and manage your satsang events</p>
                  </div>
                  <Button
                    onClick={() => setShowCreateEvent(true)}
                    className="btn-primary shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                    data-testid="create-event-button"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Event
                  </Button>
                </div>

                {loading ? (
                  <div className="text-center py-12"><p className="text-gray-500">Loading events...</p></div>
                ) : events.length === 0 ? (
                  <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200">
                    <CardContent className="py-12 text-center">
                      <Calendar className="w-16 h-16 text-orange-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No events created yet</p>
                      <Button onClick={() => setShowCreateEvent(true)} className="btn-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Event
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {events.map((event, idx) => (
                      <Card
                        key={event.id}
                        className="bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all hover:scale-[1.02] border-2 border-orange-200"
                        style={{animationDelay: `${idx * 0.1}s`}}
                        data-testid={`event-item-${event.id}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-2xl font-bold text-gray-800 font-serif">{event.title}</h3>
                                <Badge className={new Date(event.start_date) > new Date() ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                                  {new Date(event.start_date) > new Date() ? "🟢 Upcoming" : "✓ Completed"}
                                </Badge>
                                <Badge className="bg-orange-100 text-orange-700">{event.category}</Badge>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Calendar className="w-4 h-4 text-orange-500" />
                                  <span className="text-sm">{format(new Date(event.start_date), "PPP")}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Clock className="w-4 h-4 text-orange-500" />
                                  <span className="text-sm">{format(new Date(event.start_date), "p")}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <MapPin className="w-4 h-4 text-orange-500" />
                                  <span className="text-sm">{event.location || event.meeting_link || "Online"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Users className="w-4 h-4 text-orange-500" />
                                  <span className="text-sm">{event.registered_count}/{event.capacity}</span>
                                </div>
                              </div>

                              <div className="mt-4">
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-orange-500 to-amber-600 rounded-full transition-all"
                                    style={{width: `${(event.registered_count / event.capacity) * 100}%`}}
                                  ></div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 ml-6">
                              <Link to={`/events/${event.id}`}>
                                <Button variant="outline" size="sm" title="View Details">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Link to={`/edit-event/${event.id}`}>
                                <Button variant="outline" size="sm" className="text-orange-600" title="Edit">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Registrations Tab */}
              <TabsContent value="registrations" className="space-y-6 mt-8 animate-fade-in">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 font-serif">Registrations</h2>
                  <p className="text-gray-600 mt-1">View and manage event registrations</p>
                </div>

                <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Label>Select Event</Label>
                      <Select onValueChange={fetchEventRegistrations}>
                        <SelectTrigger data-testid="select-event-registrations">
                          <SelectValue placeholder="Choose an event..." />
                        </SelectTrigger>
                        <SelectContent>
                          {events.map(event => (
                            <SelectItem key={event.id} value={event.id}>
                              {event.title} ({event.registered_count} registered)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {registrations.length > 0 && (
                        <div className="mt-6 space-y-2" data-testid="registrations-list">
                          {registrations.map(reg => (
                            <div key={reg.id} className="flex items-center justify-between p-4 border-2 border-orange-100 rounded-lg hover:bg-orange-50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold">
                                  {reg.user_name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800">{reg.user_name}</p>
                                  <p className="text-sm text-gray-600">{reg.user_email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={reg.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                                  {reg.status}
                                </Badge>
                                <Badge className={reg.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                                  {reg.payment_status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6 mt-8 animate-fade-in">
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200">
                  <CardContent className="p-12 text-center">
                    <BarChart3 className="w-16 h-16 text-orange-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 font-serif">Analytics Coming Soon</h3>
                    <p className="text-gray-600">Detailed insights and reports will be available here</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6 mt-8 animate-fade-in">
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200">
                  <CardContent className="p-12 text-center">
                    <Settings className="w-16 h-16 text-orange-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 font-serif">Settings</h3>
                    <p className="text-gray-600">Configure your account and preferences</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Enhanced Create Event Modal */}
      {showCreateEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-amber-600 text-white p-6 rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-serif">Create New Satsang Event</h2>
                <button
                  onClick={() => setShowCreateEvent(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  data-testid="close-modal"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateEvent} className="p-6 space-y-6">
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Bhagavad Gita Discourse"
                  className="border-2 border-orange-200 focus:border-orange-400"
                  required
                  data-testid="modal-event-title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your satsang event..."
                  rows={4}
                  className="border-2 border-orange-200 focus:border-orange-400 resize-none"
                  required
                  data-testid="modal-event-description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger className="border-2 border-orange-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meditation">Meditation</SelectItem>
                      <SelectItem value="discourse">Discourse</SelectItem>
                      <SelectItem value="bhajan">Bhajan</SelectItem>
                      <SelectItem value="karma-yoga">Karma Yoga</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="retreat">Retreat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="event_type">Event Type *</Label>
                  <Select value={formData.event_type} onValueChange={(value) => setFormData({...formData, event_type: value})}>
                    <SelectTrigger className="border-2 border-orange-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-person">In-Person</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date & Time *</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    className="border-2 border-orange-200 focus:border-orange-400"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="end_date">End Date & Time *</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    className="border-2 border-orange-200 focus:border-orange-400"
                    required
                  />
                </div>
              </div>

              {(formData.event_type === "in-person" || formData.event_type === "hybrid") && (
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Address or venue name"
                    className="border-2 border-orange-200 focus:border-orange-400"
                  />
                </div>
              )}

              {(formData.event_type === "online" || formData.event_type === "hybrid") && (
                <div>
                  <Label htmlFor="meeting_link">Meeting Link</Label>
                  <Input
                    id="meeting_link"
                    value={formData.meeting_link}
                    onChange={(e) => setFormData({...formData, meeting_link: e.target.value})}
                    placeholder="https://zoom.us/j/123456789"
                    className="border-2 border-orange-200 focus:border-orange-400"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacity">Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    min="1"
                    className="border-2 border-orange-200 focus:border-orange-400"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    min="0"
                    placeholder="0.00 for free"
                    className="border-2 border-orange-200 focus:border-orange-400"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cover_image">Cover Image URL</Label>
                <Input
                  id="cover_image"
                  value={formData.cover_image}
                  onChange={(e) => setFormData({...formData, cover_image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  className="border-2 border-orange-200 focus:border-orange-400"
                />
              </div>

              <div>
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                  placeholder="What attendees should bring..."
                  rows={3}
                  className="border-2 border-orange-200 focus:border-orange-400 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="yoga, mindfulness, spiritual"
                  className="border-2 border-orange-200 focus:border-orange-400"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t-2 border-orange-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateEvent(false)}
                  className="flex-1 border-2 border-orange-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:shadow-xl hover:scale-105 transition-all"
                  data-testid="submit-event"
                >
                  Create Event
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedHostDashboard;
