import requests
import sys
import json
from datetime import datetime, timedelta
import uuid

class SatsangAPITester:
    def __init__(self, base_url="https://bhakti-gather.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.attendee_token = None
        self.host_token = None
        self.attendee_user = None
        self.host_user = None
        self.test_event_id = None
        self.test_registration_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
            self.failed_tests.append(f"{name}: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, token=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        if token:
            test_headers['Authorization'] = f'Bearer {token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            
            if success:
                self.log_test(name, True)
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                self.log_test(name, False, f"Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json().get('detail', 'Unknown error')
                except:
                    error_detail = response.text
                return False, {"error": error_detail}

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {"error": str(e)}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "",
            200
        )
        return success

    def test_attendee_signup(self):
        """Test attendee signup"""
        attendee_data = {
            "name": f"Test Attendee {datetime.now().strftime('%H%M%S')}",
            "email": f"attendee_{datetime.now().strftime('%H%M%S')}@test.com",
            "password": "TestPass123!",
            "phone": "+1234567890",
            "is_host": False
        }
        
        success, response = self.run_test(
            "Attendee Signup",
            "POST",
            "auth/signup",
            200,
            data=attendee_data
        )
        
        if success and 'access_token' in response:
            self.attendee_token = response['access_token']
            self.attendee_user = response['user']
            return True
        return False

    def test_host_signup(self):
        """Test host signup"""
        host_data = {
            "name": f"Test Host {datetime.now().strftime('%H%M%S')}",
            "email": f"host_{datetime.now().strftime('%H%M%S')}@test.com",
            "password": "TestPass123!",
            "phone": "+1234567891",
            "is_host": True
        }
        
        success, response = self.run_test(
            "Host Signup",
            "POST",
            "auth/signup",
            200,
            data=host_data
        )
        
        if success and 'access_token' in response:
            self.host_token = response['access_token']
            self.host_user = response['user']
            return True
        return False

    def test_login(self):
        """Test login with host credentials"""
        if not self.host_user:
            return False
            
        login_data = {
            "email": self.host_user['email'],
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        return success

    def test_get_me(self):
        """Test get current user endpoint"""
        if not self.attendee_token:
            return False
            
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200,
            token=self.attendee_token
        )
        return success

    def test_create_event(self):
        """Test event creation by host"""
        if not self.host_token:
            return False
            
        start_date = datetime.now() + timedelta(days=7)
        end_date = start_date + timedelta(hours=2)
        
        event_data = {
            "title": f"Test Meditation Session {datetime.now().strftime('%H%M%S')}",
            "description": "A peaceful meditation session for spiritual growth and inner peace.",
            "category": "meditation",
            "event_type": "in-person",
            "location": "123 Peace Street, Spiritual Center",
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "capacity": 50,
            "price": 25.00,
            "cover_image": "https://example.com/meditation.jpg",
            "requirements": "Bring a meditation cushion",
            "tags": ["meditation", "mindfulness", "spiritual"],
            "status": "published"
        }
        
        success, response = self.run_test(
            "Create Event",
            "POST",
            "events",
            200,
            data=event_data,
            token=self.host_token
        )
        
        if success and 'id' in response:
            self.test_event_id = response['id']
            return True
        return False

    def test_get_events(self):
        """Test get all events"""
        success, response = self.run_test(
            "Get All Events",
            "GET",
            "events",
            200
        )
        return success

    def test_get_event_detail(self):
        """Test get specific event"""
        if not self.test_event_id:
            return False
            
        success, response = self.run_test(
            "Get Event Detail",
            "GET",
            f"events/{self.test_event_id}",
            200
        )
        return success

    def test_search_events(self):
        """Test event search functionality"""
        success, response = self.run_test(
            "Search Events",
            "GET",
            "events?search=meditation&category=meditation",
            200
        )
        return success

    def test_get_host_events(self):
        """Test get host's events"""
        if not self.host_token:
            return False
            
        success, response = self.run_test(
            "Get Host Events",
            "GET",
            "events/host/my-events",
            200,
            token=self.host_token
        )
        return success

    def test_update_event(self):
        """Test event update"""
        if not self.test_event_id or not self.host_token:
            return False
            
        update_data = {
            "title": f"Updated Test Event {datetime.now().strftime('%H%M%S')}",
            "description": "Updated description for the meditation session."
        }
        
        success, response = self.run_test(
            "Update Event",
            "PUT",
            f"events/{self.test_event_id}",
            200,
            data=update_data,
            token=self.host_token
        )
        return success

    def test_create_registration_free(self):
        """Test registration for free event"""
        if not self.test_event_id or not self.attendee_token:
            return False
            
        # First, update event to be free
        update_data = {"price": 0.0}
        self.run_test(
            "Update Event to Free",
            "PUT",
            f"events/{self.test_event_id}",
            200,
            data=update_data,
            token=self.host_token
        )
        
        # Now register
        reg_data = {"event_id": self.test_event_id}
        
        success, response = self.run_test(
            "Create Free Registration",
            "POST",
            "registrations",
            200,
            data=reg_data,
            token=self.attendee_token
        )
        
        if success and 'id' in response:
            self.test_registration_id = response['id']
            return True
        return False

    def test_get_my_registrations(self):
        """Test get user's registrations"""
        if not self.attendee_token:
            return False
            
        success, response = self.run_test(
            "Get My Registrations",
            "GET",
            "registrations/my-registrations",
            200,
            token=self.attendee_token
        )
        return success

    def test_get_event_registrations(self):
        """Test get event registrations (host only)"""
        if not self.test_event_id or not self.host_token:
            return False
            
        success, response = self.run_test(
            "Get Event Registrations",
            "GET",
            f"registrations/event/{self.test_event_id}",
            200,
            token=self.host_token
        )
        return success

    def test_create_paid_registration(self):
        """Test registration for paid event (should create registration but require payment)"""
        if not self.test_event_id or not self.attendee_token:
            return False
            
        # Update event to be paid
        update_data = {"price": 25.0}
        self.run_test(
            "Update Event to Paid",
            "PUT",
            f"events/{self.test_event_id}",
            200,
            data=update_data,
            token=self.host_token
        )
        
        # Create new attendee for paid registration
        attendee_data = {
            "name": f"Paid Attendee {datetime.now().strftime('%H%M%S')}",
            "email": f"paid_attendee_{datetime.now().strftime('%H%M%S')}@test.com",
            "password": "TestPass123!",
            "is_host": False
        }
        
        signup_success, signup_response = self.run_test(
            "Create Paid Attendee",
            "POST",
            "auth/signup",
            200,
            data=attendee_data
        )
        
        if not signup_success:
            return False
            
        paid_token = signup_response['access_token']
        
        # Register for paid event
        reg_data = {"event_id": self.test_event_id}
        
        success, response = self.run_test(
            "Create Paid Registration",
            "POST",
            "registrations",
            200,
            data=reg_data,
            token=paid_token
        )
        return success

    def test_stripe_checkout(self):
        """Test Stripe checkout session creation"""
        if not self.test_event_id or not self.attendee_token:
            return False
            
        checkout_data = {
            "event_id": self.test_event_id,
            "origin_url": "https://bhakti-gather.preview.emergentagent.com"
        }
        
        success, response = self.run_test(
            "Create Stripe Checkout",
            "POST",
            "payments/checkout",
            200,
            data=checkout_data,
            token=self.attendee_token
        )
        
        if success and 'url' in response and 'session_id' in response:
            return True
        return False

    def test_unauthorized_access(self):
        """Test unauthorized access scenarios"""
        # Test creating event without host role
        event_data = {
            "title": "Unauthorized Event",
            "description": "This should fail",
            "category": "meditation",
            "event_type": "online",
            "start_date": (datetime.now() + timedelta(days=1)).isoformat(),
            "end_date": (datetime.now() + timedelta(days=1, hours=1)).isoformat(),
            "capacity": 10,
            "price": 0
        }
        
        success, response = self.run_test(
            "Unauthorized Event Creation",
            "POST",
            "events",
            403,
            data=event_data,
            token=self.attendee_token
        )
        return success

    def test_delete_event(self):
        """Test event deletion"""
        if not self.test_event_id or not self.host_token:
            return False
            
        success, response = self.run_test(
            "Delete Event",
            "DELETE",
            f"events/{self.test_event_id}",
            200,
            token=self.host_token
        )
        return success

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Satsang API Tests...")
        print("=" * 50)
        
        # Basic API tests
        self.test_root_endpoint()
        
        # Authentication tests
        self.test_attendee_signup()
        self.test_host_signup()
        self.test_login()
        self.test_get_me()
        
        # Event management tests
        self.test_create_event()
        self.test_get_events()
        self.test_get_event_detail()
        self.test_search_events()
        self.test_get_host_events()
        self.test_update_event()
        
        # Registration tests
        self.test_create_registration_free()
        self.test_get_my_registrations()
        self.test_get_event_registrations()
        self.test_create_paid_registration()
        
        # Payment tests
        self.test_stripe_checkout()
        
        # Security tests
        self.test_unauthorized_access()
        
        # Cleanup
        self.test_delete_event()
        
        # Print results
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.failed_tests:
            print("\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"  - {test}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = SatsangAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())