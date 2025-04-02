
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { saveAs } from 'file-saver';

interface QRCodePaymentProps {
  onPaymentComplete?: (paymentData: any) => void;
}

const QRCodePayment: React.FC<QRCodePaymentProps> = ({ onPaymentComplete }) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [paymentPurpose, setPaymentPurpose] = useState('premium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();

  const generateQRCode = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid payment amount',
        variant: 'destructive',
      });
      return;
    }

    // Create a payment payload
    const payload = {
      amount: parseFloat(amount),
      currency: 'USD',
      method: paymentMethod,
      purpose: paymentPurpose,
      timestamp: new Date().toISOString(),
      reference: `NEXA-${Date.now().toString().slice(-8)}`,
    };

    // Convert to JSON string for QR code
    const qrData = JSON.stringify(payload);
    setQrValue(qrData);
    setShowQR(true);
  };

  const simulatePayment = () => {
    if (!qrValue) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowQR(false);
      
      const paymentData = JSON.parse(qrValue);
      
      if (onPaymentComplete) {
        onPaymentComplete({
          ...paymentData,
          status: 'completed',
          confirmedAt: new Date().toISOString(),
        });
      }
      
      toast({
        title: 'Payment Successful',
        description: `Your payment of $${amount} has been processed successfully.`,
      });
      
      // Reset form
      setAmount('');
      setPaymentPurpose('premium');
    }, 2000);
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('payment-qrcode') as HTMLElement;
    if (canvas) {
      const svgData = new XMLSerializer().serializeToString(canvas);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      saveAs(blob, `nexacore-payment-${Date.now()}.svg`);
      
      toast({
        title: 'QR Code Downloaded',
        description: 'You can scan this QR code to complete your payment.',
      });
    }
  };

  return (
    <Card className="bg-nexacore-blue-dark/50 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">QR Code Payment</CardTitle>
        <CardDescription className="text-white/70">
          Make a payment using a QR code
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!showQR ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-white">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment-method" className="text-white">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="payment-method" className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wallet">Digital Wallet</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment-purpose" className="text-white">Payment Purpose</Label>
              <Select value={paymentPurpose} onValueChange={setPaymentPurpose}>
                <SelectTrigger id="payment-purpose" className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select payment purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="premium">Premium Subscription</SelectItem>
                  <SelectItem value="donation">Donation</SelectItem>
                  <SelectItem value="service">Service Fee</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              className="w-full bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
              onClick={generateQRCode}
            >
              Generate Payment QR Code
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG
                id="payment-qrcode"
                value={qrValue}
                size={200}
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="H"
                includeMargin={true}
              />
            </div>
            
            <div className="text-center">
              <p className="text-white font-semibold mb-1">Amount: ${amount}</p>
              <p className="text-white/70 text-sm">Scan this QR code to complete your payment</p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => setShowQR(false)}
              >
                Back
              </Button>
              
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={downloadQRCode}
              >
                Download QR
              </Button>
              
              <Button
                className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
                onClick={simulatePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-r-transparent" />
                    Processing...
                  </>
                ) : (
                  'Simulate Payment'
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <p className="text-xs text-white/50">
          This is a demo payment system. No actual money will be transferred. In a real application, this would connect to a payment processor.
        </p>
      </CardFooter>
    </Card>
  );
};

export default QRCodePayment;
