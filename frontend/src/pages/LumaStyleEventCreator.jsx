import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../App";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Calendar, MapPin, Link as LinkIcon, Users, DollarSign, Settings,
  Image as ImageIcon, Tag, Clock, Globe, Video, Building2, Palette,
  Mail, Bell, Share2, Copy, CheckCircle2, Sparkles, Upload, X
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const LumaStyleEventCreator = ({ user, isEdit }) => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchingEvent, setFetchingEvent] = useState(isEdit);
  const [activeTab, setActiveTab] = useState("details");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

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
    tags: "",
    status: "published",
    require_approval: false,
    theme: "spiritual"
  });

  const [previewThemes] = useState([
    { id: "spiritual", name: "Spiritual", gradient: "from-orange-400 via-amber-500 to-yellow-500" },
    { id: "minimal", name: "Minimal", gradient: "from-gray-400 via-gray-500 to-gray-600" },
    { id: "nature", name: "Nature", gradient: "from-green-400 via-emerald-500 to-teal-500" },
    { id: "wisdom", name: "Wisdom", gradient: "from-purple-400 via-indigo-500 to-blue-500" },
    { id: "sunset", name: "Sunset", gradient: "from-pink-400 via-rose-500 to-red-500" }
  ]);

  useEffect(() => {
    if (isEdit && eventId) {
      fetchEvent();
    }
  }, [isEdit, eventId]);

  const fetchEvent = async () => {
    try {
      const response = await axiosInstance.get(`/events/${eventId}`);
      const event = response.data;

      if (event.host_id !== user.id) {
        toast.error("You are not authorized to edit this event");
        navigate("/");
        return;
      }

      setFormData({
        title: event.title,
        description: event.description,
        category: event.category,
        event_type: event.event_type,
        location: event.location || "",
        meeting_link: event.meeting_link || "",
        start_date: new Date(event.start_date).toISOString().slice(0, 16),
        end_date: new Date(event.end_date).toISOString().slice(0, 16),
        capacity: event.capacity,
        price: event.price,
        cover_image: event.cover_image || "",
        requirements: event.requirements || "",
        tags: event.tags.join(", "),
        status: event.status,
        require_approval: false,
        theme: "spiritual"
      });
      if (event.cover_image) {
        setImagePreview(event.cover_image);
      }
    } catch (error) {
      toast.error("Failed to load event");
      navigate("/dashboard");
    } finally {
      setFetchingEvent(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    setUploadingImage(true);

    try {
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setFormData({ ...formData, cover_image: base64String });
        toast.success("Image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, cover_image: "" });
    toast.success("Image removed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag),
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity)
      };

      if (isEdit) {
        await axiosInstance.put(`/events/${eventId}`, payload);
        toast.success("Event updated successfully!");
      } else {
        await axiosInstance.post("/events", payload);
        toast.success("Event created successfully!");
      }

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  const getThemeGradient = () => {
    return previewThemes.find(t => t.id === formData.theme)?.gradient || previewThemes[0].gradient;
  };

  if (fetchingEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading event...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8" data-testid="luma-event-creator">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-orange-600 hover:text-orange-700 mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-800 font-serif mb-2">
            {isEdit ? "Edit Event" : "🪔 Create Your Satsang"}
          </h1>
          <p className="text-gray-600">✨ Design a beautiful event page that inspires attendance</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Live Preview */}
            <div className="space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-orange-200 p-8 sticky top-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-4">
                    <Sparkles className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-semibold text-orange-700">Live Preview</span>
                  </div>
                </div>

                {/* Event Card Preview */}
                <div className="space-y-6 animate-fade-in">
                  {/* Cover Image/Gradient */}
                  <div
                    className={`w-full h-64 rounded-xl ${!imagePreview && !formData.cover_image ? `bg-gradient-to-br ${getThemeGradient()}` : ''} relative overflow-hidden shadow-lg`}
                    style={{
                      backgroundImage: imagePreview || formData.cover_image
                        ? `url(${imagePreview || formData.cover_image})`
                        : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                  >
                    {!imagePreview && !formData.cover_image && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm opacity-70">Upload Cover Image</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg font-semibold">
                      🎉 FREE Event
                    </div>
                  </div>

                  {/* Event Title */}
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 font-serif mb-2">
                      {formData.title || "Your Event Title"}
                    </h2>
                    <p className="text-gray-600">Hosted by {user.name}</p>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 font-semibold">Date</p>
                        <p className="text-sm font-medium text-gray-800">
                          {formData.start_date
                            ? format(new Date(formData.start_date), "PPP 'at' p")
                            : "Select date & time"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      {formData.event_type === "online" ? (
                        <Video className="w-5 h-5 text-orange-600" />
                      ) : (
                        <MapPin className="w-5 h-5 text-orange-600" />
                      )}
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 font-semibold">Location</p>
                        <p className="text-sm font-medium text-gray-800">
                          {formData.event_type === "online"
                            ? formData.meeting_link || "Virtual Event"
                            : formData.location || "Add location"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <Users className="w-5 h-5 text-orange-600" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 font-semibold">Capacity</p>
                        <p className="text-sm font-medium text-gray-800">
                          {formData.capacity ? `${formData.capacity} attendees` : "Unlimited"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description Preview */}
                  {formData.description && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 font-semibold mb-2">About</p>
                      <p className="text-sm text-gray-700 line-clamp-3">{formData.description}</p>
                    </div>
                  )}

                  {/* Tags Preview */}
                  {formData.tags && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.split(",").map((tag, idx) => (
                        tag.trim() && (
                          <Badge key={idx} variant="secondary" className="bg-orange-100 text-orange-700">
                            {tag.trim()}
                          </Badge>
                        )
                      ))}
                    </div>
                  )}

                  {/* Register Button Preview */}
                  <Button className="w-full btn-primary py-6 text-lg font-semibold shadow-lg" disabled>
                    🎉 Register for Free
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border-2 border-orange-200">
                  <TabsTrigger value="details" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
                    <Settings className="w-4 h-4 mr-2" />
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="design" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
                    <Palette className="w-4 h-4 mr-2" />
                    Design
                  </TabsTrigger>
                  <TabsTrigger value="options" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
                    <Users className="w-4 h-4 mr-2" />
                    Options
                  </TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-6 mt-6">
                  <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200">
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <Label htmlFor="title" className="text-base font-semibold">🕉️ Event Name *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., Morning Meditation & Chanting"
                          className="mt-2 border-2 border-orange-200 focus:border-orange-400 text-lg"
                          required
                          data-testid="event-title"
                        />
                      </div>

                      <div>
                        <Label htmlFor="description" className="text-base font-semibold">📿 Description *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Share what makes this satsang special..."
                          rows={6}
                          className="mt-2 border-2 border-orange-200 focus:border-orange-400 resize-none"
                          required
                          data-testid="event-description"
                        />
                      </div>

                      <Separator className="bg-orange-200" />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category" className="text-base font-semibold">🧘 Category *</Label>
                          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                            <SelectTrigger className="mt-2 border-2 border-orange-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="meditation">🧘 Meditation</SelectItem>
                              <SelectItem value="discourse">📚 Discourse</SelectItem>
                              <SelectItem value="bhajan">🎶 Bhajan</SelectItem>
                              <SelectItem value="karma-yoga">🙏 Karma Yoga</SelectItem>
                              <SelectItem value="workshop">✨ Workshop</SelectItem>
                              <SelectItem value="retreat">🌿 Retreat</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="event_type" className="text-base font-semibold">🌐 Event Type *</Label>
                          <Select value={formData.event_type} onValueChange={(value) => setFormData({ ...formData, event_type: value })}>
                            <SelectTrigger className="mt-2 border-2 border-orange-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="in-person">
                                <div className="flex items-center gap-2">
                                  <Building2 className="w-4 h-4" />
                                  In-Person
                                </div>
                              </SelectItem>
                              <SelectItem value="online">
                                <div className="flex items-center gap-2">
                                  <Video className="w-4 h-4" />
                                  Online
                                </div>
                              </SelectItem>
                              <SelectItem value="hybrid">
                                <div className="flex items-center gap-2">
                                  <Globe className="w-4 h-4" />
                                  Hybrid
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Separator className="bg-orange-200" />

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="start_date" className="text-base font-semibold flex items-center gap-2">
                            📅 Start Date & Time *
                          </Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500 pointer-events-none" />
                            <Input
                              id="start_date"
                              type="datetime-local"
                              value={formData.start_date}
                              min={new Date().toISOString().slice(0, 16)}
                              onChange={(e) => {
                                setFormData({ ...formData, start_date: e.target.value });
                                // Auto-update end date if it's before start date
                                if (formData.end_date && e.target.value >= formData.end_date) {
                                  const newEndDate = new Date(e.target.value);
                                  newEndDate.setHours(newEndDate.getHours() + 2); // Add 2 hours
                                  setFormData(prev => ({ 
                                    ...prev, 
                                    start_date: e.target.value,
                                    end_date: newEndDate.toISOString().slice(0, 16)
                                  }));
                                  toast.info("End time updated to 2 hours after start time");
                                }
                              }}
                              className="mt-1 pl-11 border-2 border-orange-200 focus:border-orange-400 hover:border-orange-300 transition-colors bg-white text-gray-900"
                              style={{
                                colorScheme: 'light',
                              }}
                              required
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">📌 Event start date and time</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="end_date" className="text-base font-semibold flex items-center gap-2">
                            ⏰ End Date & Time *
                          </Label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500 pointer-events-none" />
                            <Input
                              id="end_date"
                              type="datetime-local"
                              value={formData.end_date}
                              min={formData.start_date || new Date().toISOString().slice(0, 16)}
                              onChange={(e) => {
                                if (formData.start_date && e.target.value <= formData.start_date) {
                                  toast.error("End time must be after start time!");
                                  return;
                                }
                                setFormData({ ...formData, end_date: e.target.value });
                              }}
                              className="mt-1 pl-11 border-2 border-orange-200 focus:border-orange-400 hover:border-orange-300 transition-colors bg-white text-gray-900"
                              style={{
                                colorScheme: 'light',
                              }}
                              required
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">🏁 Event end date and time</p>
                        </div>
                      </div>
                      
                      {/* Date validation message */}
                      {formData.start_date && formData.end_date && formData.start_date >= formData.end_date && (
                        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 flex items-center gap-2">
                          <X className="w-5 h-5 text-red-600" />
                          <p className="text-sm text-red-700 font-semibold">
                            ⚠️ End time must be after start time!
                          </p>
                        </div>
                      )}

                      {(formData.event_type === "in-person" || formData.event_type === "hybrid") && (
                        <div>
                          <Label htmlFor="location" className="text-base font-semibold flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            📍 Location
                          </Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="123 Peace Street, Ashram City, State 12345"
                            className="mt-2 border-2 border-orange-200 focus:border-orange-400"
                          />
                        </div>
                      )}

                      {(formData.event_type === "online" || formData.event_type === "hybrid") && (
                        <div>
                          <Label htmlFor="meeting_link" className="text-base font-semibold flex items-center gap-2">
                            <LinkIcon className="w-4 h-4" />
                            🔗 Meeting Link
                          </Label>
                          <Input
                            id="meeting_link"
                            value={formData.meeting_link}
                            onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                            placeholder="https://zoom.us/j/123456789"
                            className="mt-2 border-2 border-orange-200 focus:border-orange-400"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Design Tab */}
                <TabsContent value="design" className="space-y-6 mt-6">
                  <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200">
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <Label className="text-base font-semibold mb-4 block">🎨 Event Theme</Label>
                        <div className="grid grid-cols-5 gap-3">
                          {previewThemes.map((theme) => (
                            <button
                              key={theme.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, theme: theme.id })}
                              className={`aspect-square rounded-xl bg-gradient-to-br ${theme.gradient} relative transition-all ${
                                formData.theme === theme.id
                                  ? "ring-4 ring-orange-500 scale-105 shadow-lg"
                                  : "hover:scale-105 hover:shadow-md"
                              }`}
                            >
                              {formData.theme === theme.id && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                                  <CheckCircle2 className="w-8 h-8 text-white" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Selected: {previewThemes.find(t => t.id === formData.theme)?.name}</p>
                      </div>

                      <Separator className="bg-orange-200" />

                      <div>
                        <Label className="text-base font-semibold flex items-center gap-2 mb-4">
                          <ImageIcon className="w-4 h-4" />
                          🖼️ Cover Image Upload
                        </Label>
                        
                        {imagePreview || formData.cover_image ? (
                          <div className="relative">
                            <img
                              src={imagePreview || formData.cover_image}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-xl border-2 border-orange-200"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="border-2 border-dashed border-orange-300 rounded-xl p-8 text-center hover:border-orange-400 transition-colors cursor-pointer block">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              disabled={uploadingImage}
                            />
                            {uploadingImage ? (
                              <div className="flex flex-col items-center gap-3">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                                <p className="text-gray-600">Uploading...</p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                                  <Upload className="w-8 h-8 text-orange-600" />
                                </div>
                                <div>
                                  <p className="text-gray-700 font-semibold">Click to upload cover image</p>
                                  <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                                </div>
                              </div>
                            )}
                          </label>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          💡 Tip: Use high-quality images (1200x630px recommended)
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="tags" className="text-base font-semibold flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          🏷️ Tags (comma-separated)
                        </Label>
                        <Input
                          id="tags"
                          value={formData.tags}
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                          placeholder="yoga, mindfulness, meditation, spiritual growth"
                          className="mt-2 border-2 border-orange-200 focus:border-orange-400"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Options Tab */}
                <TabsContent value="options" className="space-y-6 mt-6">
                  <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200">
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="capacity" className="text-base font-semibold flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            👥 Capacity *
                          </Label>
                          <Input
                            id="capacity"
                            type="number"
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                            min="1"
                            className="mt-2 border-2 border-orange-200 focus:border-orange-400"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">Maximum number of attendees</p>
                        </div>

                        <div>
                          <Label className="text-base font-semibold flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            💰 Ticket Price
                          </Label>
                          <div className="mt-2 p-3 bg-green-100 border-2 border-green-300 rounded-lg">
                            <p className="text-sm font-bold text-green-800">🎉 FREE for All Attendees!</p>
                            <p className="text-xs text-green-700 mt-1">Your guests register at no cost</p>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-orange-200" />

                      <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                        <div className="flex-1">
                          <Label htmlFor="require_approval" className="text-base font-semibold cursor-pointer">
                            ✅ Require Approval
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">Manually approve each registration</p>
                        </div>
                        <Switch
                          id="require_approval"
                          checked={formData.require_approval}
                          onCheckedChange={(checked) => setFormData({ ...formData, require_approval: checked })}
                        />
                      </div>

                      <Separator className="bg-orange-200" />

                      <div>
                        <Label htmlFor="requirements" className="text-base font-semibold">📋 Requirements & Instructions</Label>
                        <Textarea
                          id="requirements"
                          value={formData.requirements}
                          onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                          placeholder="What should attendees bring? Any prerequisites?"
                          rows={4}
                          className="mt-2 border-2 border-orange-200 focus:border-orange-400 resize-none"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/dashboard")}
                      className="flex-1 border-2 border-orange-300 hover:bg-orange-50"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:shadow-xl hover:scale-105 transition-all text-white font-semibold py-6"
                      disabled={loading}
                      data-testid="publish-event"
                    >
                      {loading ? (
                        "Saving..."
                      ) : isEdit ? (
                        "✓ Update Event"
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          🕉️ Publish Event
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LumaStyleEventCreator;
