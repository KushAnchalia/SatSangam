import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Sparkles, ArrowRight, Check, ExternalLink } from "lucide-react";

const EventCreationPayment = () => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleProceed = () => {
    setProcessing(true);
    // Redirect to Buy Me a Coffee page
    window.open('https://buymeacoffee.com/kushanchalia', '_blank');
    
    // Show message and allow proceeding after 3 seconds
    setTimeout(() => {
      setProcessing(false);
    }, 3000);
  };

  const handleContinueToCreate = () => {
    navigate("/create-event-form");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-12 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-300 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-300 rounded-full blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Floating Puja Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] text-6xl animate-float" style={{animationDelay: '0s'}}>🛐</div>
        <div className="absolute top-[20%] right-[15%] text-5xl animate-float" style={{animationDelay: '0.5s'}}>🕉️</div>
        <div className="absolute bottom-[20%] left-[20%] text-6xl animate-float" style={{animationDelay: '1s'}}>🛕</div>
        <div className="absolute bottom-[30%] right-[10%] text-5xl animate-float" style={{animationDelay: '1.5s'}}>🙏</div>
        <div className="absolute top-[50%] left-[5%] text-4xl animate-float" style={{animationDelay: '2s'}}>ૐ</div>
        <div className="absolute top-[40%] right-[5%] text-5xl animate-float" style={{animationDelay: '2.5s'}}>🪔</div>
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="text-7xl mb-4 animate-bounce">🕉️</div>
          <h1 className="text-5xl font-bold text-gray-800 font-serif mb-4">
            Host Your Sacred Gathering
          </h1>
          <p className="text-xl text-gray-600">Platform fee to create your satsang event</p>
        </div>

        <Card className="bg-white/90 backdrop-blur-lg border-4 border-orange-200 shadow-2xl animate-slide-in-right">
          <CardContent className="p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full mb-6 shadow-lg animate-pulse">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 font-serif mb-2">Event Creation Fee</h2>
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600 mb-2">
                ₹90
              </div>
              <p className="text-gray-600 font-semibold">Minimum fee per event</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 mb-8 border-2 border-orange-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-600" />
                What's Included:
              </h3>
              <div className="space-y-3">
                {[
                  "Beautiful event page with live preview",
                  "Unlimited free attendee registrations",
                  "Email confirmations for all guests",
                  "QR code tickets for check-in",
                  "Real-time guest management dashboard",
                  "Event analytics and insights",
                  "Share on social media",
                  "Mobile-friendly event pages"
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 animate-fade-in" style={{animationDelay: `${idx * 0.1}s`}}>
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-orange-100 rounded-xl p-6 mb-8 border-2 border-orange-300">
              <div className="flex items-start gap-3">
                <span className="text-3xl">💡</span>
                <div>
                  <h4 className="font-bold text-orange-900 mb-1">Why ₹90 Minimum?</h4>
                  <p className="text-orange-800 text-sm">
                    This helps us maintain the platform and provide excellent service. 
                    All attendee registrations remain <strong>completely FREE</strong> - you never charge your guests!
                    You can contribute more if you'd like to support the platform.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleProceed}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:shadow-2xl hover:scale-105 transition-all text-white font-bold py-8 text-xl"
                data-testid="proceed-payment-button"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Opening payment page...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 mr-3" />
                    Support ₹90+ & Create Event
                    <ExternalLink className="w-6 h-6 ml-3" />
                  </>
                )}
              </Button>

              {!processing && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                  <p className="text-green-800 font-semibold mb-3">
                    ✅ Already completed payment?
                  </p>
                  <Button
                    onClick={handleContinueToCreate}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                    data-testid="continue-to-create-button"
                  >
                    Continue to Create Event →
                  </Button>
                </div>
              )}
              
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="w-full border-2 border-orange-300 hover:bg-orange-50"
                disabled={processing}
              >
                Maybe Later
              </Button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              🔒 Secure payment processing • No hidden fees • Instant access
            </p>
          </CardContent>
        </Card>

        <div className="text-center mt-8 animate-fade-in" style={{animationDelay: '0.5s'}}>
          <p className="text-gray-600">
            <span className="font-semibold">Demo Mode:</span> This is a preview of the payment page. 
            Actual payment integration coming soon! 🙏
          </p>
        </div>
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

export default EventCreationPayment;
