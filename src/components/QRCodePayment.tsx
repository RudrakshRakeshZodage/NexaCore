
import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { saveAs } from 'file-saver';
import { Camera, QrCode, PlusCircle, Clock, IndianRupee } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  method: string;
  purpose: string;
  timestamp: string;
  reference: string;
  status: 'completed' | 'pending' | 'failed';
}

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
  const [showScanner, setShowScanner] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState("payment");
  const { toast } = useToast();

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Load any existing transactions from localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem('nexacore-transactions');
    if (savedTransactions) {
      try {
        setTransactionHistory(JSON.parse(savedTransactions));
      } catch (e) {
        console.error('Error loading saved transactions:', e);
      }
    }
  }, []);

  // Save transactions to localStorage when they change
  useEffect(() => {
    if (transactionHistory.length > 0) {
      localStorage.setItem('nexacore-transactions', JSON.stringify(transactionHistory));
    }
  }, [transactionHistory]);

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
      currency: 'INR',
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
      
      // Create a new transaction record
      const newTransaction: Transaction = {
        id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        amount: paymentData.amount,
        currency: paymentData.currency,
        method: paymentData.method,
        purpose: paymentData.purpose,
        timestamp: new Date().toISOString(),
        reference: paymentData.reference,
        status: 'completed'
      };
      
      // Add to transaction history
      setTransactionHistory(prev => [newTransaction, ...prev]);
      
      if (onPaymentComplete) {
        onPaymentComplete({
          ...paymentData,
          status: 'completed',
          confirmedAt: new Date().toISOString(),
        });
      }
      
      toast({
        title: 'Payment Successful',
        description: `Your payment of ₹${paymentData.amount} has been processed successfully.`,
      });
      
      // Reset form
      setAmount('');
      setPaymentPurpose('premium');
      
      // Switch to transaction history tab
      setActiveTab("history");
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

  const startQRScanner = async () => {
    setShowScanner(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Set up QR code detection (simulated for demo)
        setTimeout(() => {
          // Simulate finding a QR code after 3 seconds
          const mockPaymentData = {
            amount: Math.floor(Math.random() * 5000) + 500,
            currency: 'INR',
            method: 'wallet',
            purpose: 'service',
            timestamp: new Date().toISOString(),
            reference: `SCAN-${Date.now().toString().slice(-8)}`,
          };
          
          processQRCode(mockPaymentData);
          
          // Stop the camera
          if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
          }
          setShowScanner(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: 'Camera Error',
        description: 'Unable to access your camera for QR scanning.',
        variant: 'destructive',
      });
      setShowScanner(false);
    }
  };

  const processQRCode = (paymentData: any) => {
    // Create a new transaction
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      amount: paymentData.amount,
      currency: paymentData.currency || 'INR',
      method: paymentData.method || 'scan',
      purpose: paymentData.purpose || 'payment',
      timestamp: new Date().toISOString(),
      reference: paymentData.reference || `SCAN-${Date.now().toString().slice(-8)}`,
      status: 'completed'
    };
    
    // Add to transaction history
    setTransactionHistory(prev => [newTransaction, ...prev]);
    
    if (onPaymentComplete) {
      onPaymentComplete({
        ...paymentData,
        status: 'completed',
        confirmedAt: new Date().toISOString(),
      });
    }
    
    toast({
      title: 'QR Code Scanned',
      description: `Payment of ₹${paymentData.amount} processed for ${paymentData.purpose}.`,
    });
    
    // Switch to transaction history tab
    setActiveTab("history");
  };

  const handleQRImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // For demo purposes, simulate processing an uploaded QR image
    setTimeout(() => {
      const mockPaymentData = {
        amount: Math.floor(Math.random() * 5000) + 1000,
        currency: 'INR',
        method: 'card',
        purpose: 'donation',
        timestamp: new Date().toISOString(),
        reference: `UPLOAD-${Date.now().toString().slice(-8)}`,
      };
      
      processQRCode(mockPaymentData);
    }, 1000);
  };

  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowScanner(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card className="bg-nexacore-blue-dark/50 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">QR Code Payment</CardTitle>
        <CardDescription className="text-white/70">
          Make or scan QR code payments
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/10 mb-6">
          <TabsTrigger value="payment" className="data-[state=active]:bg-nexacore-teal data-[state=active]:text-nexacore-blue-dark">
            Make Payment
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-nexacore-teal data-[state=active]:text-nexacore-blue-dark">
            Transaction History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="payment" className="space-y-4">
          {showScanner ? (
            <div className="space-y-4">
              <div className="relative">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full rounded-lg border-2 border-dashed border-white/30"
                  style={{ height: "240px" }}
                ></video>
                <div className="absolute inset-0 border-2 border-nexacore-teal/50 rounded-lg flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-nexacore-teal rounded-lg"></div>
                </div>
                <div className="absolute top-2 right-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white/10 text-white hover:bg-white/20"
                    onClick={stopScanner}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
              <p className="text-center text-white/70">
                Position the QR code within the frame
              </p>
            </div>
          ) : !showQR ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white">Amount (₹)</Label>
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
                    <SelectItem value="upi">UPI</SelectItem>
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
              
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button 
                  className="w-full bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
                  onClick={generateQRCode}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Generate Payment QR
                </Button>
                
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-white/10 text-white hover:bg-white/20"
                    onClick={startQRScanner}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Scan QR
                  </Button>
                  
                  <Button 
                    className="flex-1 bg-white/10 text-white hover:bg-white/20"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    Upload QR
                  </Button>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleQRImageUpload}
                  />
                </div>
              </div>
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
                <p className="text-white font-semibold mb-1">Amount: ₹{amount}</p>
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
        </TabsContent>
        
        <TabsContent value="history">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Transaction History</h3>
              <Button 
                variant="outline" 
                size="sm"
                className="text-white border-white/20 hover:bg-white/10"
                onClick={() => setActiveTab("payment")}
              >
                New Payment
              </Button>
            </div>
            
            {transactionHistory.length === 0 ? (
              <div className="py-12 text-center">
                <Clock className="mx-auto h-12 w-12 text-white/30" />
                <p className="mt-4 text-white/50">No transaction history yet</p>
                <p className="text-white/30 text-sm">Complete a payment to see your history</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {transactionHistory.map((transaction) => (
                  <div key={transaction.id} className="p-3 bg-white/10 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-white">
                          ₹{transaction.amount.toFixed(2)} - {transaction.purpose.charAt(0).toUpperCase() + transaction.purpose.slice(1)}
                        </p>
                        <p className="text-sm text-white/70">
                          {formatDate(transaction.timestamp)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                          {transaction.status}
                        </span>
                        <p className="text-xs text-white/50 mt-1">{transaction.method}</p>
                      </div>
                    </div>
                    <p className="text-xs text-white/40 mt-2">Ref: {transaction.reference}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <CardFooter>
        <p className="text-xs text-white/50">
          This is a demo payment system. No actual money will be transferred. In a real application, this would connect to a payment processor.
        </p>
      </CardFooter>
    </Card>
  );
};

export default QRCodePayment;
