
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
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import DashboardLayout from "@/components/DashboardLayout";

const FinanceRecommendation = ({ income, expenses, goals, employment }: any) => {
  if (!income || !expenses || !goals || !employment) {
    return <p className="text-white/70">Please fill out all fields to get personalized recommendations.</p>;
  }

  const incomeNum = parseFloat(income);
  const expensesNum = parseFloat(expenses);
  const savings = incomeNum - expensesNum;
  
  return (
    <div className="space-y-4 bg-nexacore-blue-dark/50 p-4 rounded-xl border border-white/10">
      <h3 className="text-lg font-semibold flex items-center">
        <DollarSign className="mr-2 text-nexacore-teal" size={20} />
        Your Financial Analysis
      </h3>
      
      <div className="flex justify-between items-center mb-2 p-3 rounded-lg bg-white/5">
        <div>
          <p className="text-sm text-white/70">Monthly Balance</p>
          <p className={`text-xl font-medium ${savings >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ₹{savings.toFixed(2)}
          </p>
        </div>
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${savings >= 0 ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}`}>
          {savings >= 0 ? <TrendingUp size={20} /> : <TrendingUp size={20} className="transform rotate-180" />}
        </div>
      </div>
      
      <div className="space-y-3">
        <h4 className="text-white/90 font-medium">Recommendations:</h4>
        
        <div className="bg-white/5 p-3 rounded-lg border-l-2 border-nexacore-teal">
          <h5 className="font-medium text-nexacore-teal">Budgeting</h5>
          <p className="text-sm text-white/80">
            {savings >= 0 
              ? `You're saving ₹${savings.toFixed(2)} monthly. Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings/debt.` 
              : `You're spending ₹${Math.abs(savings).toFixed(2)} more than your income. Try reducing non-essential expenses.`}
          </p>
        </div>
        
        <div className="bg-white/5 p-3 rounded-lg border-l-2 border-nexacore-teal">
          <h5 className="font-medium text-nexacore-teal">Side Income</h5>
          <p className="text-sm text-white/80">
            {employment === 'student' 
              ? 'Consider tutoring, content creation, or part-time virtual assistance.'
              : employment === 'freelancer'
                ? 'Expand your client base and skills. Consider creating digital products.'
                : 'Look into passive income sources like dividend stocks or rental properties.'}
          </p>
        </div>
        
        <div className="bg-white/5 p-3 rounded-lg border-l-2 border-nexacore-teal">
          <h5 className="font-medium text-nexacore-teal">Investment</h5>
          <p className="text-sm text-white/80">
            {incomeNum < 10000 
              ? 'Start small with a savings account or low-risk mutual funds.'
              : incomeNum < 50000
                ? 'Consider a mix of mutual funds and blue-chip stocks.'
                : 'Diversify with stocks, bonds, and potentially real estate investment trusts (REITs).'}
          </p>
        </div>
      </div>
    </div>
  );
};

const FinancePage = () => {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [goals, setGoals] = useState('');
  const [employment, setEmployment] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentTo, setPaymentTo] = useState('');
  const [isRecommendationGenerated, setIsRecommendationGenerated] = useState(false);
  
  const { toast } = useToast();
  
  const handleGenerateRecommendation = () => {
    if (!income || !expenses || !goals || !employment) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields to get recommendations.",
        variant: "destructive"
      });
      return;
    }
    
    setIsRecommendationGenerated(true);
    toast({
      title: "Recommendations generated",
      description: "Your personalized financial recommendations are ready!",
      variant: "default"
    });
  };
  
  const handleSendPayment = () => {
    if (!upiId || !paymentAmount || !paymentTo) {
      toast({
        title: "Missing information",
        description: "Please fill out all payment details.",
        variant: "destructive"
      });
      return;
    }
    
    // Mock payment processing
    setTimeout(() => {
      toast({
        title: "Payment sent",
        description: `₹${paymentAmount} sent to ${paymentTo} successfully.`,
        variant: "default"
      });
      
      // Reset fields
      setPaymentAmount('');
      setPaymentTo('');
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Finance</h1>
            <p className="text-white/70">Manage your financial data and get AI-powered recommendations</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-nexacore-teal/20 flex items-center justify-center">
            <PieChart className="text-nexacore-teal" size={24} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Wallet className="mr-2 text-nexacore-teal" size={20} />
                  Financial Information
                </CardTitle>
                <CardDescription className="text-white/70">
                  Enter your financial details to get personalized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="income" className="text-white">Monthly Income (₹)</Label>
                    <Input 
                      id="income" 
                      type="number" 
                      placeholder="e.g., 25000" 
                      className="bg-white/10 border-white/20 text-white" 
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expenses" className="text-white">Monthly Expenses (₹)</Label>
                    <Input 
                      id="expenses" 
                      type="number" 
                      placeholder="e.g., 15000" 
                      className="bg-white/10 border-white/20 text-white" 
                      value={expenses}
                      onChange={(e) => setExpenses(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goals" className="text-white">Financial Goals</Label>
                  <Input 
                    id="goals" 
                    type="text" 
                    placeholder="e.g., Save for education, buy a laptop" 
                    className="bg-white/10 border-white/20 text-white" 
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employment" className="text-white">Employment Status</Label>
                  <select 
                    id="employment" 
                    className="w-full h-10 rounded-md border bg-white/10 border-white/20 text-white px-3 py-2" 
                    value={employment}
                    onChange={(e) => setEmployment(e.target.value)}
                  >
                    <option value="">Select status</option>
                    <option value="student">Student</option>
                    <option value="freelancer">Freelancer</option>
                    <option value="employed">Employed</option>
                    <option value="business">Business Owner</option>
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleGenerateRecommendation} 
                  className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
                >
                  Generate Recommendations
                </Button>
              </CardFooter>
            </Card>

            {isRecommendationGenerated && (
              <Card className="bg-nexacore-blue-dark/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="mr-2 text-nexacore-teal" size={20} />
                    AI Recommendations
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Personalized financial advice based on your inputs
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
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Send className="mr-2 text-nexacore-teal" size={20} />
                  Payments
                </CardTitle>
                <CardDescription className="text-white/70">
                  Send and manage payments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="upi" className="text-white">Your UPI ID</Label>
                  <Input 
                    id="upi" 
                    type="text" 
                    placeholder="username@bank" 
                    className="bg-white/10 border-white/20 text-white" 
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10"></span>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-nexacore-blue-dark px-2 text-white/40">Send Payment</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-to" className="text-white">Recipient</Label>
                  <Input 
                    id="payment-to" 
                    type="text" 
                    placeholder="Name or UPI ID" 
                    className="bg-white/10 border-white/20 text-white"
                    value={paymentTo}
                    onChange={(e) => setPaymentTo(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-amount" className="text-white">Amount (₹)</Label>
                  <Input 
                    id="payment-amount" 
                    type="number" 
                    placeholder="0.00" 
                    className="bg-white/10 border-white/20 text-white" 
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    onClick={handleSendPayment}
                    className="w-full bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
                  >
                    Send Payment
                  </Button>
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <QrCode size={16} className="mr-2" />
                    Scan QR
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Clock size={16} className="mr-2" />
                    History
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CreditCard className="mr-2 text-nexacore-teal" size={20} />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {[
                    { name: "Amazon", date: "Today", amount: "-₹1,200" },
                    { name: "Salary Deposit", date: "Yesterday", amount: "+₹25,000" },
                    { name: "Netflix", date: "2 days ago", amount: "-₹499" }
                  ].map((transaction, index) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center mr-3">
                          {transaction.amount.startsWith("+") ? 
                            <TrendingUp size={16} className="text-green-400" /> : 
                            <ArrowRight size={16} className="text-red-400" />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{transaction.name}</p>
                          <p className="text-xs text-white/60">{transaction.date}</p>
                        </div>
                      </div>
                      <p className={transaction.amount.startsWith("+") ? "text-green-400" : "text-red-400"}>
                        {transaction.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  View All Transactions
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FinancePage;
