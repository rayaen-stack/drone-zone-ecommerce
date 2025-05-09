import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Smartphone, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface MpesaPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  phoneNumber: string | undefined;
  amount: number;
  onPhoneNumberChange?: (phoneNumber: string) => void;
}

enum PaymentStage {
  PROMPT,
  PROCESSING,
  PIN_ENTRY,
  COMPLETE,
}

export function MpesaPaymentModal({
  open,
  onClose,
  onComplete,
  phoneNumber: initialPhoneNumber,
  amount,
  onPhoneNumberChange,
}: MpesaPaymentModalProps) {
  const [stage, setStage] = useState<PaymentStage>(PaymentStage.PROMPT);
  const [pin, setPin] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>(initialPhoneNumber || "");
  
  useEffect(() => {
    if (open) {
      setStage(PaymentStage.PROMPT);
      setPin("");
      setPhoneNumber(initialPhoneNumber || "");
    }
  }, [open, initialPhoneNumber]);

  // Phone number validation
  const isValidPhone = () => {
    // Basic validation for Kenyan phone numbers in international format
    const phoneRegex = /^254[17]\d{8}$/;
    return phoneRegex.test(phoneNumber);
  };
  
  const handleRequestPayment = () => {
    if (!isValidPhone()) {
      return;
    }
    
    setStage(PaymentStage.PROCESSING);
    
    // Simulate network delay
    setTimeout(() => {
      setStage(PaymentStage.PIN_ENTRY);
    }, 2000);
  };

  const handlePinSubmit = () => {
    if (pin.length !== 4) return;
    
    setStage(PaymentStage.PROCESSING);
    
    // Simulate processing time
    setTimeout(() => {
      setStage(PaymentStage.COMPLETE);
    }, 3000);
  };

  const handleFinish = () => {
    onComplete();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>M-Pesa Payment</DialogTitle>
          <DialogDescription>
            Pay using M-Pesa for your order
          </DialogDescription>
        </DialogHeader>

        {stage === PaymentStage.PROMPT && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Smartphone className="h-10 w-10 text-green-500" />
              <div>
                <p className="font-semibold">M-Pesa Mobile Payment</p>
                <p className="text-sm text-muted-foreground">
                  You will receive a prompt on your phone to complete this payment
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                value={phoneNumber} 
                onChange={(e) => {
                  const newValue = e.target.value;
                  setPhoneNumber(newValue);
                  // Update the parent component's state if callback exists
                  if (onPhoneNumberChange) {
                    onPhoneNumberChange(newValue);
                  }
                }}
                placeholder="Enter your M-Pesa phone number"
                maxLength={12}
              />
              <p className="text-xs text-muted-foreground">
                Enter your phone number in the format 254XXXXXXXXX
              </p>
            </div>

            <div className="grid gap-2">
              <Label>Amount</Label>
              <div className="px-3 py-2 border rounded-md bg-muted/50">
                {formatCurrency(amount)}
              </div>
            </div>

            <Button 
              onClick={handleRequestPayment} 
              disabled={!isValidPhone()}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Request Payment Prompt
            </Button>
            {!isValidPhone() && phoneNumber.length > 0 && (
              <p className="text-xs text-red-500">
                Please enter a valid M-Pesa phone number in the format 254XXXXXXXXX
              </p>
            )}
          </div>
        )}

        {stage === PaymentStage.PROCESSING && (
          <div className="py-8 flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-green-500" />
            <p className="mt-4 text-center">
              Processing your M-Pesa payment...
            </p>
          </div>
        )}

        {stage === PaymentStage.PIN_ENTRY && (
          <div className="space-y-4">
            <div className="p-3 bg-green-50 border border-green-100 rounded-md">
              <p className="text-green-800 text-sm">
                A payment request has been sent to {phoneNumber}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin">Enter M-Pesa PIN</Label>
              <Input
                id="pin"
                type="password"
                placeholder="Enter your M-Pesa PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value.slice(0, 4))}
                maxLength={4}
                pattern="[0-9]*"
                inputMode="numeric"
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">
                For demonstration purposes only. Do not enter your real M-Pesa PIN.
              </p>
            </div>

            <Button
              onClick={handlePinSubmit}
              disabled={pin.length !== 4}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Submit PIN
            </Button>
          </div>
        )}

        {stage === PaymentStage.COMPLETE && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-4">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold">Payment Successful!</h3>
              <p className="text-center text-muted-foreground mt-2">
                Your M-Pesa payment of {formatCurrency(amount)} has been processed successfully.
              </p>
            </div>

            <Button onClick={handleFinish} className="w-full">
              Complete Order
            </Button>
          </div>
        )}
        
        <DialogFooter className="sm:justify-start">
          {stage !== PaymentStage.COMPLETE && stage !== PaymentStage.PROCESSING && (
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}