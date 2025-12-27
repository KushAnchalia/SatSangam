import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../App";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";

const PaymentSuccess = ({ user }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking"); // checking, success, failed
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 5;

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      navigate("/");
      return;
    }

    checkPaymentStatus();
  }, [sessionId]);

  const checkPaymentStatus = async () => {
    if (attempts >= maxAttempts) {
      setStatus("failed");
      toast.error("Payment verification timed out");
      return;
    }

    try {
      const response = await axiosInstance.get(`/payments/status/${sessionId}`);
      setPaymentDetails(response.data);

      if (response.data.payment_status === "paid") {
        setStatus("success");
        toast.success("Payment successful!");
      } else if (response.data.status === "expired") {
        setStatus("failed");
        toast.error("Payment session expired");
      } else {
        // Payment still pending, poll again
        setAttempts(attempts + 1);
        setTimeout(() => {
          checkPaymentStatus();
        }, 2000);
      }
    } catch (error) {
      console.error("Payment status check failed:", error);
      setStatus("failed");
      toast.error("Failed to verify payment");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12" data-testid="payment-success-page">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center font-serif">
            {status === "checking" && "Verifying Payment..."}
            {status === "success" && "Payment Successful!"}
            {status === "failed" && "Payment Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {status === "checking" && (
            <div className="flex flex-col items-center gap-4" data-testid="payment-checking">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <p className="text-muted-foreground">
                Please wait while we confirm your payment...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-6" data-testid="payment-success">
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
              <div>
                <p className="text-lg font-semibold text-foreground mb-2">
                  Your registration is confirmed!
                </p>
                <p className="text-muted-foreground">
                  You will receive a confirmation email shortly.
                </p>
              </div>
              {paymentDetails && (
                <div className="bg-muted/50 rounded-lg p-4 text-left">
                  <p className="text-sm text-muted-foreground mb-1">Payment Details</p>
                  <p className="font-semibold">
                    ${paymentDetails.amount} {paymentDetails.currency.toUpperCase()}
                  </p>
                </div>
              )}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => navigate("/my-events")}
                  className="btn-primary"
                  data-testid="view-my-events-button"
                >
                  View My Events
                </Button>
                <Button
                  onClick={() => navigate("/events")}
                  variant="outline"
                  data-testid="explore-more-button"
                >
                  Explore More Events
                </Button>
              </div>
            </div>
          )}

          {status === "failed" && (
            <div className="space-y-6" data-testid="payment-failed">
              <XCircle className="w-16 h-16 text-destructive mx-auto" />
              <div>
                <p className="text-lg font-semibold text-foreground mb-2">
                  Payment could not be verified
                </p>
                <p className="text-muted-foreground">
                  Please contact support if you were charged.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button onClick={() => navigate("/events")} className="btn-primary">
                  Back to Events
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
