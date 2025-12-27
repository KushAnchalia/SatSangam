import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../App";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";
import { Calendar } from "lucide-react";

const CreateEventPage = ({ user, isEdit }) => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchingEvent, setFetchingEvent] = useState(isEdit);

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
  });

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
      });
    } catch (error) {
      toast.error("Failed to load event");
      navigate("/dashboard");
    } finally {
      setFetchingEvent(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
      };

      if (isEdit) {
        await axiosInstance.put(`/events/${eventId}`, payload);
        toast.success("Event updated successfully");
      } else {
        await axiosInstance.post("/events", payload);
        toast.success("Event created successfully");
      }

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading event...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4" data-testid="create-event-page">
      <div className="container mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-serif">
              {isEdit ? "Edit Event" : "Create New Event"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Meditation Session with Master"
                  required
                  data-testid="event-title-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your event..."
                  rows={5}
                  required
                  data-testid="event-description-input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="category" data-testid="event-category-select">
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

                <div className="space-y-2">
                  <Label htmlFor="event-type">Event Type *</Label>
                  <Select
                    value={formData.event_type}
                    onValueChange={(value) => setFormData({ ...formData, event_type: value })}
                  >
                    <SelectTrigger id="event-type" data-testid="event-type-select">
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

              {(formData.event_type === "in-person" || formData.event_type === "hybrid") && (
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="123 Peace St, Ashram City, State 12345"
                    data-testid="event-location-input"
                  />
                </div>
              )}

              {(formData.event_type === "online" || formData.event_type === "hybrid") && (
                <div className="space-y-2">
                  <Label htmlFor="meeting-link">Meeting Link</Label>
                  <Input
                    id="meeting-link"
                    value={formData.meeting_link}
                    onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                    placeholder="https://zoom.us/j/123456789"
                    data-testid="event-meeting-link-input"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date & Time *</Label>
                  <Input
                    id="start-date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                    data-testid="event-start-date-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date & Time *</Label>
                  <Input
                    id="end-date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                    data-testid="event-end-date-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    min="1"
                    required
                    data-testid="event-capacity-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    min="0"
                    placeholder="0.00 for free events"
                    required
                    data-testid="event-price-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover-image">Cover Image URL</Label>
                <Input
                  id="cover-image"
                  value={formData.cover_image}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  data-testid="event-cover-image-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="What attendees should bring or know..."
                  rows={3}
                  data-testid="event-requirements-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="yoga, mindfulness, spiritual"
                  data-testid="event-tags-input"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  data-testid="save-event-button"
                >
                  {loading ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  data-testid="cancel-button"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateEventPage;
