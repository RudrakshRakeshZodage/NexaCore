
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  PieChart, 
  Wallet, 
  DollarSign, 
  TrendingUp, 
  Briefcase, 
  Send, 
  Clock, 
  CreditCard,
  QrCode,
  ArrowRight,
  ReceiptText,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  EyeOff,
  Plus,
  MessageSquare,
  Smartphone,
  Landmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadialProgress } from "@/components/ui/radial-progress";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DashboardLayout from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";

// Mock data
const mockTransactions = [
  { id: 1, type: "sent", amount: 500, to: "Rahul Sharma", date: "Today, 10:45 AM", status: "completed" },
  { id: 2, type: "received", amount: 1200, from: "Priya Patel", date: "Yesterday, 2:30 PM", status: "completed" },
  { id: 3, type: "sent", amount: 350, to: "Grocery Store", date: "25 Jun, 6:15 PM", status: "completed" },
  { id: 4, type: "received", amount: 5000, from: "Salary Deposit", date: "1 Jun, 9:00 AM", status: "completed" },
  { id: 5, type: "sent", amount: 800, to: "Rent Payment", date: "1 Jun, 11:30 AM", status: "completed" },
  { id: 6, type: "sent", amount: 200, to: "Mobile Recharge", date: "28 May, 9:45 PM", status: "failed" },
];

// Finance recommendation component
const FinanceRecommendation = ({ income, expenses, goals, employment }: any) => {
  if (!income || !expenses || !goals || !employment) {
    return <p className="text-white/70 dark:text-foreground/70">Please fill out all fields to get personalized recommendations.</p>;
  }

  // Basic calculations
  const incomeValue = parseFloat(income) || 0;
  const expensesValue = parseFloat(expenses) || 0;
  const savings = Math.max(0, incomeValue - expensesValue);
  const savingsPercentage = incomeValue > 0 ? (savings / incomeValue) * 100 : 0;
  
  const isLowIncome = incomeValue < 20000;
  const isHighExpenses = expensesValue > incomeValue * 0.7;
  const isStudent = employment === "student";
  
  return (
    <div className="space-y-4 bg-nexacore-blue-dark/50 dark:bg-card/50 p-4 rounded-xl border border-white/10 dark:border-border">
      <h3 className="text-lg font-semibold flex items-center">
        <Wallet className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
        Financial Overview
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 dark:bg-foreground/5 p-3 rounded-lg flex flex-col items-center justify-center">
          <div className="text-sm text-white/70 dark:text-foreground/70 mb-2">Monthly Income</div>
          <div className="text-xl font-bold text-white dark:text-foreground">₹{incomeValue.toLocaleString()}</div>
        </div>
        
        <div className="bg-white/5 dark:bg-foreground/5 p-3 rounded-lg flex flex-col items-center justify-center">
          <div className="text-sm text-white/70 dark:text-foreground/70 mb-2">Monthly Expenses</div>
          <div className="text-xl font-bold text-white dark:text-foreground">₹{expensesValue.toLocaleString()}</div>
        </div>
        
        <div className="bg-white/5 dark:bg-foreground/5 p-3 rounded-lg flex flex-col items-center justify-center">
          <div className="text-sm text-white/70 dark:text-foreground/70 mb-2">Monthly Savings</div>
          <div className="text-xl font-bold text-nexacore-teal dark:text-primary">₹{savings.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-white/70 dark:text-foreground/70">Savings Rate</span>
          <span className="text-sm font-medium text-white dark:text-foreground">{savingsPercentage.toFixed(1)}%</span>
        </div>
        <Progress value={savingsPercentage} className="h-2" />
        <p className="text-xs text-white/60 dark:text-foreground/60">
          {savingsPercentage < 10 
            ? "Your savings rate is very low. Try to increase savings to at least 20% of income." 
            : savingsPercentage < 20 
              ? "Your savings rate is below recommended levels (20-30%)." 
              : "Great job! You're saving at a healthy rate."}
        </p>
      </div>
      
      <div className="bg-white/5 dark:bg-foreground/5 p-3 rounded-lg space-y-3">
        <h4 className="font-medium text-nexacore-teal dark:text-primary">AI Recommendations</h4>
        
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-white dark:text-foreground">Budgeting</h5>
          <p className="text-sm text-white/80 dark:text-foreground/80">
            {isHighExpenses 
              ? "Your expenses are too high relative to income. Create a budget to track spending and identify areas to cut back." 
              : "Maintain your current spending habits and consider using a budget tracking app to optimize further."}
          </p>
        </div>
        
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-white dark:text-foreground">Income Opportunities</h5>
          <ul className="space-y-1">
            {isStudent && (
              <>
                <li className="text-sm text-white/80 dark:text-foreground/80 flex items-start">
                  <ArrowRight size={12} className="mr-2 mt-1 text-nexacore-teal dark:text-primary" />
                  Tutoring younger students (₹150-300 per hour)
                </li>
                <li className="text-sm text-white/80 dark:text-foreground/80 flex items-start">
                  <ArrowRight size={12} className="mr-2 mt-1 text-nexacore-teal dark:text-primary" />
                  Content writing for websites (₹500-1500 per article)
                </li>
              </>
            )}
            {employment === "freelancer" && (
              <>
                <li className="text-sm text-white/80 dark:text-foreground/80 flex items-start">
                  <ArrowRight size={12} className="mr-2 mt-1 text-nexacore-teal dark:text-primary" />
                  Expand your services to international platforms like Upwork or Fiverr
                </li>
                <li className="text-sm text-white/80 dark:text-foreground/80 flex items-start">
                  <ArrowRight size={12} className="mr-2 mt-1 text-nexacore-teal dark:text-primary" />
                  Create and sell digital products based on your expertise
                </li>
              </>
            )}
            {employment === "employed" && (
              <>
                <li className="text-sm text-white/80 dark:text-foreground/80 flex items-start">
                  <ArrowRight size={12} className="mr-2 mt-1 text-nexacore-teal dark:text-primary" />
                  Explore part-time consulting in your field of expertise
                </li>
                <li className="text-sm text-white/80 dark:text-foreground/80 flex items-start">
                  <ArrowRight size={12} className="mr-2 mt-1 text-nexacore-teal dark:text-primary" />
                  Develop skills for promotion or better job opportunities
                </li>
              </>
            )}
            <li className="text-sm text-white/80 dark:text-foreground/80 flex items-start">
              <ArrowRight size={12} className="mr-2 mt-1 text-nexacore-teal dark:text-primary" />
              Online surveys and user testing (₹100-500 per survey)
            </li>
          </ul>
        </div>
        
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-white dark:text-foreground">Investment Ideas</h5>
          {savings > 1000 ? (
            <ul className="space-y-1">
              <li className="text-sm text-white/80 dark:text-foreground/80 flex items-start">
                <ArrowRight size={12} className="mr-2 mt-1 text-nexacore-teal dark:text-primary" />
                Start a recurring deposit (5-6% annual returns)
              </li>
              {savings > 5000 && (
                <li className="text-sm text-white/80 dark:text-foreground/80 flex items-start">
                  <ArrowRight size={12} className="mr-2 mt-1 text-nexacore-teal dark:text-primary" />
                  Consider index funds or ETFs for long-term growth
                </li>
              )}
            </ul>
          ) : (
            <p className="text-sm text-white/80 dark:text-foreground/80">
              Focus on increasing savings before considering investments. Aim for at least ₹5,000 in monthly savings.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Radial Progress Component (since we don't have it yet in the existing UI components)
import React from "react";

const FinancePage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Finance form state
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [goals, setGoals] = useState("");
  const [employment, setEmployment] = useState("");
  const [isRecommendationGenerated, setIsRecommendationGenerated] = useState(false);
  
  // Payment system state
  const [activePaymentTab, setActivePaymentTab] = useState("send");
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState(25000);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [recipientUpiId, setRecipientUpiId] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState(10000);
  const [limitUsed, setLimitUsed] = useState(2850);
  
  const handleGenerateRecommendation = () => {
    if (!income || !expenses || !goals || !employment) {
      toast({
        title: "Missing information",
        description: "Please fill in all your financial details",
        variant: "destructive"
      });
      return;
    }
    
    setIsRecommendationGenerated(true);
    toast({
      title: "Analysis completed",
      description: "Your financial recommendations are ready!",
      variant: "default"
    });
  };
  
  const handleSendPayment = () => {
    const amount = parseFloat(paymentAmount);
    
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid payment amount",
        variant: "destructive"
      });
      return;
    }
    
    if (!recipientUpiId) {
      toast({
        title: "Missing recipient",
        description: "Please enter recipient's UPI ID",
        variant: "destructive"
      });
      return;
    }
    
    if (amount > balance) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance for this transaction",
        variant: "destructive"
      });
      return;
    }
    
    // Process payment
    setBalance(prevBalance => prevBalance - amount);
    setLimitUsed(prevLimit => prevLimit + amount);
    
    // Add to transactions
    const newTransaction = {
      id: transactions.length + 1,
      type: "sent",
      amount,
      to: recipientUpiId,
      date: new Date().toLocaleString(),
      status: "completed"
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    // Reset form
    setPaymentAmount("");
    setRecipientUpiId("");
    setPaymentNote("");
    
    toast({
      title: "Payment sent",
      description: `₹${amount} sent to ${recipientUpiId} successfully`,
      variant: "default"
    });
  };
  
  const handleRequestPayment = () => {
    const amount = parseFloat(paymentAmount);
    
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid payment amount",
        variant: "destructive"
      });
      return;
    }
    
    if (!recipientUpiId) {
      toast({
        title: "Missing payer",
        description: "Please enter payer's UPI ID",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Payment request sent",
      description: `Request for ₹${amount} sent to ${recipientUpiId}`,
      variant: "default"
    });
    
    // Reset form
    setPaymentAmount("");
    setRecipientUpiId("");
    setPaymentNote("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Finance</h1>
            <p className="text-white/70 dark:text-foreground/70">Track your finances and manage payments</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-nexacore-teal/20 dark:bg-primary/20 flex items-center justify-center">
            <PieChart className="text-nexacore-teal dark:text-primary" size={24} />
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-white/10 dark:bg-foreground/10 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background">
              Overview
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background">
              Payments
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background">
              History
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                  <CardHeader>
                    <CardTitle className="text-white dark:text-card-foreground flex items-center">
                      <Wallet className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                      Financial Information
                    </CardTitle>
                    <CardDescription className="text-white/70 dark:text-card-foreground/70">
                      Enter your financial details for personalized advice
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="income" className="text-white dark:text-card-foreground">
                        Monthly Income (₹)
                      </Label>
                      <Input 
                        id="income" 
                        placeholder="e.g., 25000" 
                        className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground" 
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="expenses" className="text-white dark:text-card-foreground">
                        Monthly Expenses (₹)
                      </Label>
                      <Input 
                        id="expenses" 
                        placeholder="e.g., 15000" 
                        className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground" 
                        value={expenses}
                        onChange={(e) => setExpenses(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="goals" className="text-white dark:text-card-foreground">
                        Financial Goals
                      </Label>
                      <Input 
                        id="goals" 
                        placeholder="e.g., Save for education, Buy a laptop" 
                        className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground" 
                        value={goals}
                        onChange={(e) => setGoals(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="employment" className="text-white dark:text-card-foreground">
                        Employment Status
                      </Label>
                      <Select value={employment} onValueChange={setEmployment}>
                        <SelectTrigger id="employment" className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground">
                          <SelectValue placeholder="Select employment status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="freelancer">Freelancer</SelectItem>
                          <SelectItem value="employed">Employed</SelectItem>
                          <SelectItem value="business_owner">Business Owner</SelectItem>
                          <SelectItem value="unemployed">Unemployed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleGenerateRecommendation} 
                      className="bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                    >
                      Generate Recommendations
                    </Button>
                  </CardFooter>
                </Card>

                {isRecommendationGenerated && (
                  <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                    <CardHeader>
                      <CardTitle className="text-white dark:text-card-foreground flex items-center">
                        <TrendingUp className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                        AI Financial Insights
                      </CardTitle>
                      <CardDescription className="text-white/70 dark:text-card-foreground/70">
                        Personalized financial recommendations based on your inputs
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FinanceRecommendation 
                        income={income} 
                        expenses={expenses} 
                        goals={goals} 
                        employment={employment} 
                      />
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle className="text-white dark:text-card-foreground flex items-center">
                        <Wallet className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                        Balance
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setShowBalance(!showBalance)}
                        className="h-8 w-8"
                      >
                        {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col items-center justify-center p-6">
                      <div className="text-3xl font-bold text-white dark:text-card-foreground">
                        {showBalance ? `₹${balance.toLocaleString()}` : "₹•••••"}
                      </div>
                      <p className="text-sm text-white/70 dark:text-card-foreground/70 mt-2">
                        Available Balance
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <DialogTrigger asChild>
                        <Button variant="outline" className="border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10 w-full">
                          <Send size={16} className="mr-2" />
                          Send
                        </Button>
                      </DialogTrigger>
                      <Button 
                        variant="outline" 
                        className="border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10 w-full"
                        onClick={() => {
                          setActivePaymentTab("request");
                          navigate("/finance?tab=payments");
                        }}
                      >
                        <QrCode size={16} className="mr-2" />
                        Request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                  <CardHeader>
                    <CardTitle className="text-white dark:text-card-foreground flex items-center">
                      <Clock className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                      Monthly Spending
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col items-center justify-center p-4">
                      <div className="relative h-40 w-40">
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-lg font-bold text-white dark:text-card-foreground">₹{limitUsed.toLocaleString()}</span>
                          <span className="text-xs text-white/70 dark:text-card-foreground/70">of ₹{monthlyLimit.toLocaleString()}</span>
                        </div>
                        <svg className="h-40 w-40" viewBox="0 0 100 100">
                          <circle
                            className="text-white/10 dark:text-foreground/10"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="38"
                            cx="50"
                            cy="50"
                          />
                          <circle
                            className="text-nexacore-teal dark:text-primary"
                            strokeWidth="8"
                            strokeDasharray={`${(limitUsed / monthlyLimit) * 239} 239`}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="38"
                            cx="50"
                            cy="50"
                          />
                        </svg>
                      </div>
                      
                      <div className="mt-4 text-sm text-white/80 dark:text-card-foreground/80">
                        {(monthlyLimit - limitUsed) > 0 
                          ? `₹${(monthlyLimit - limitUsed).toLocaleString()} remaining`
                          : "Monthly limit reached"}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <Button 
                        variant="outline" 
                        className="w-full border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10"
                        onClick={() => {
                          const newLimit = parseInt(prompt("Enter new monthly limit:", monthlyLimit.toString()) || "0");
                          if (newLimit > 0) {
                            setMonthlyLimit(newLimit);
                            toast({
                              title: "Limit Updated",
                              description: `Monthly spending limit updated to ₹${newLimit.toLocaleString()}`,
                              variant: "default",
                            });
                          }
                        }}
                      >
                        Adjust Monthly Limit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white dark:text-card-foreground flex items-center">
                        <CreditCard className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                        Payment Center
                      </CardTitle>
                      <Tabs defaultValue={activePaymentTab} onValueChange={setActivePaymentTab} className="w-auto">
                        <TabsList className="bg-white/10 dark:bg-foreground/10 h-8">
                          <TabsTrigger value="send" className="text-xs h-6 px-2 data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background">
                            Send Money
                          </TabsTrigger>
                          <TabsTrigger value="request" className="text-xs h-6 px-2 data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background">
                            Request Money
                          </TabsTrigger>
                          <TabsTrigger value="scan" className="text-xs h-6 px-2 data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background">
                            Scan QR
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <TabsContent value="send" className="mt-0 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount" className="text-white dark:text-card-foreground">
                          Amount (₹)
                        </Label>
                        <Input 
                          id="amount" 
                          placeholder="Enter amount" 
                          className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground" 
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          type="number"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="recipient" className="text-white dark:text-card-foreground">
                          Recipient UPI ID
                        </Label>
                        <Input 
                          id="recipient" 
                          placeholder="e.g., name@upi" 
                          className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground" 
                          value={recipientUpiId}
                          onChange={(e) => setRecipientUpiId(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="note" className="text-white dark:text-card-foreground">
                          Note (Optional)
                        </Label>
                        <Input 
                          id="note" 
                          placeholder="What's this payment for?" 
                          className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground" 
                          value={paymentNote}
                          onChange={(e) => setPaymentNote(e.target.value)}
                        />
                      </div>
                      
                      <Button 
                        className="w-full bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                        onClick={handleSendPayment}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send Payment
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="request" className="mt-0 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="req-amount" className="text-white dark:text-card-foreground">
                          Amount (₹)
                        </Label>
                        <Input 
                          id="req-amount" 
                          placeholder="Enter amount" 
                          className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground" 
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          type="number"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="payer" className="text-white dark:text-card-foreground">
                          Payer UPI ID
                        </Label>
                        <Input 
                          id="payer" 
                          placeholder="e.g., name@upi" 
                          className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground" 
                          value={recipientUpiId}
                          onChange={(e) => setRecipientUpiId(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="req-note" className="text-white dark:text-card-foreground">
                          Note (Optional)
                        </Label>
                        <Input 
                          id="req-note" 
                          placeholder="What's this request for?" 
                          className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground" 
                          value={paymentNote}
                          onChange={(e) => setPaymentNote(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Button 
                          className="bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                          onClick={handleRequestPayment}
                        >
                          <ReceiptText className="mr-2 h-4 w-4" />
                          Request Payment
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10"
                          onClick={() => {
                            setActivePaymentTab("scan");
                          }}
                        >
                          <QrCode className="mr-2 h-4 w-4" />
                          Show My QR
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="scan" className="mt-0 space-y-4">
                      <div className="flex flex-col items-center justify-center p-6">
                        <div className="bg-white p-4 rounded-lg mb-4">
                          <div className="w-48 h-48 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=example@upi&pn=NexaCore&am=0&cu=INR')] bg-no-repeat bg-center bg-contain"></div>
                        </div>
                        <h3 className="text-lg font-medium text-white dark:text-card-foreground">Your Payment QR Code</h3>
                        <p className="text-sm text-white/70 dark:text-card-foreground/70 mt-1">user@nexacore</p>
                        
                        <div className="flex gap-3 mt-4">
                          <Button variant="outline" className="border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10">
                            <Download className="mr-2 h-4 w-4" />
                            Download QR
                          </Button>
                          <Button variant="outline" className="border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10">
                            <Share className="mr-2 h-4 w-4" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                  <CardHeader>
                    <CardTitle className="text-white dark:text-card-foreground flex items-center">
                      <Landmark className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                      Banking Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="flex flex-col items-center justify-center h-auto py-4 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10"
                        onClick={() => {
                          toast({
                            title: "Feature Coming Soon",
                            description: "Mobile recharge will be available in the next update",
                            variant: "default",
                          });
                        }}
                      >
                        <Smartphone className="h-6 w-6 mb-2" />
                        <span className="text-xs">Mobile Recharge</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="flex flex-col items-center justify-center h-auto py-4 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10"
                        onClick={() => {
                          toast({
                            title: "Feature Coming Soon",
                            description: "Bill payments will be available in the next update",
                            variant: "default",
                          });
                        }}
                      >
                        <Receipt className="h-6 w-6 mb-2" />
                        <span className="text-xs">Bill Payment</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="flex flex-col items-center justify-center h-auto py-4 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10"
                        onClick={() => {
                          toast({
                            title: "Feature Coming Soon",
                            description: "Gold investments will be available in the next update",
                            variant: "default",
                          });
                        }}
                      >
                        <CircleDollarSign className="h-6 w-6 mb-2" />
                        <span className="text-xs">Invest in Gold</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="flex flex-col items-center justify-center h-auto py-4 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10"
                        onClick={() => {
                          toast({
                            title: "Feature Coming Soon",
                            description: "Fixed deposits will be available in the next update",
                            variant: "default",
                          });
                        }}
                      >
                        <PiggyBank className="h-6 w-6 mb-2" />
                        <span className="text-xs">Fixed Deposit</span>
                      </Button>
                    </div>
                    
                    <div className="bg-white/5 dark:bg-foreground/5 p-4 rounded-lg border-l-2 border-nexacore-orange dark:border-accent">
                      <h3 className="text-sm font-medium text-white dark:text-card-foreground flex items-center">
                        <AlertCircle className="mr-2 h-4 w-4 text-nexacore-orange dark:text-accent" />
                        Important Note
                      </h3>
                      <p className="text-sm text-white/70 dark:text-card-foreground/70 mt-2">
                        This is a simulated payment system for demonstration purposes. In a production app, real UPI transactions would be integrated.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Transaction History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white dark:text-card-foreground flex items-center">
                    <Clock className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                    Transaction History
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10"
                    onClick={() => {
                      toast({
                        title: "Download Started",
                        description: "Your transaction history is being downloaded",
                        variant: "default",
                      });
                    }}
                  >
                    <Download className="mr-1 h-3 w-3" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-white/10 dark:border-foreground/10 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-white/5 dark:bg-foreground/5">
                      <TableRow className="hover:bg-white/5 dark:hover:bg-foreground/5 border-white/10 dark:border-foreground/10">
                        <TableHead className="text-white dark:text-card-foreground font-medium">Transaction</TableHead>
                        <TableHead className="text-white dark:text-card-foreground font-medium">Amount</TableHead>
                        <TableHead className="text-white dark:text-card-foreground font-medium">Date</TableHead>
                        <TableHead className="text-white dark:text-card-foreground font-medium text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.length === 0 ? (
                        <TableRow className="hover:bg-white/5 dark:hover:bg-foreground/5 border-white/10 dark:border-foreground/10">
                          <TableCell colSpan={4} className="text-center text-white/70 dark:text-card-foreground/70 py-4">
                            No transactions yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        transactions.map((transaction) => (
                          <TableRow key={transaction.id} className="hover:bg-white/5 dark:hover:bg-foreground/5 border-white/10 dark:border-foreground/10">
                            <TableCell>
                              <div className="flex items-center">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                                  transaction.type === "sent" 
                                    ? "bg-red-500/20 text-red-400" 
                                    : "bg-green-500/20 text-green-400"
                                }`}>
                                  {transaction.type === "sent" ? (
                                    <ArrowUpRight size={16} />
                                  ) : (
                                    <ArrowDownLeft size={16} />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-white dark:text-card-foreground">
                                    {transaction.type === "sent" ? `To: ${transaction.to}` : `From: ${transaction.from}`}
                                  </p>
                                  <p className="text-xs text-white/60 dark:text-card-foreground/60">
                                    {transaction.type === "sent" ? "Payment sent" : "Payment received"}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`font-medium ${
                                transaction.type === "sent" 
                                  ? "text-red-400" 
                                  : "text-green-400"
                              }`}>
                                {transaction.type === "sent" ? "-" : "+"}₹{transaction.amount.toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-white/70 dark:text-card-foreground/70">
                                {transaction.date}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                transaction.status === "completed" 
                                  ? "bg-green-500/10 text-green-400" 
                                  : transaction.status === "pending"
                                    ? "bg-yellow-500/10 text-yellow-400"
                                    : "bg-red-500/10 text-red-400"
                              }`}>
                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-white/70 dark:text-card-foreground/70">
                  Showing {transactions.length} transactions
                </div>
                <Button 
                  variant="link" 
                  className="text-nexacore-teal dark:text-primary"
                >
                  View All Transactions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FinancePage;

// Additional imports for the Finance page
import { PiggyBank, Download, Share, Receipt, CircleDollarSign } from "lucide-react";
