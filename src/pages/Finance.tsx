import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Wallet,
  PieChart,
  DollarSign,
  CreditCard,
  TrendingUp,
  LineChart,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  QrCode,
  Download,
  RefreshCw,
  ChevronRight,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import DashboardLayout from "@/components/DashboardLayout";

const Finance = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [transactions, setTransactions] = useState([
    { id: 1, type: "income", category: "Salary", amount: 3000, date: "2023-07-20", description: "Monthly salary" },
    { id: 2, type: "expense", category: "Rent", amount: 1200, date: "2023-07-15", description: "Apartment rent" },
    { id: 3, type: "expense", category: "Food", amount: 400, date: "2023-07-10", description: "Groceries and dining" },
    { id: 4, type: "income", category: "Freelance", amount: 500, date: "2023-07-05", description: "Web design project" },
    { id: 5, type: "expense", category: "Entertainment", amount: 200, date: "2023-07-01", description: "Movies and concerts" },
  ]);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");
  const [transactionCategory, setTransactionCategory] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState<Date | undefined>(new Date());
  const [transactionDescription, setTransactionDescription] = useState("");
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [investmentAmount, setInvestmentAmount] = useState(50);
  const [riskTolerance, setRiskTolerance] = useState(50);

  const handleAddTransaction = () => {
    if (!transactionCategory || !transactionAmount || !transactionDate || !transactionDescription) {
      toast({
        title: "Error",
        description: "Please fill in all transaction details.",
        variant: "destructive",
      });
      return;
    }

    const newTransaction = {
      id: transactions.length + 1,
      type: transactionType,
      category: transactionCategory,
      amount: parseFloat(transactionAmount),
      date: format(transactionDate, 'yyyy-MM-dd'),
      description: transactionDescription,
    };

    setTransactions([newTransaction, ...transactions]);
    setIsTransactionDialogOpen(false);

    toast({
      title: "Success",
      description: "Transaction added successfully.",
    });
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
    toast({
      title: "Success",
      description: "Transaction deleted successfully.",
    });
  };

  const calculateTotalBalance = () => {
    let balance = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        balance += transaction.amount;
      } else {
        balance -= transaction.amount;
      }
    });
    return balance;
  };

  const calculateTotalIncome = () => {
    let income = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        income += transaction.amount;
      }
    });
    return income;
  };

  const calculateTotalExpenses = () => {
    let expenses = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        expenses += transaction.amount;
      }
    });
    return expenses;
  };

  const investmentReturn = () => {
    const baseReturn = 0.05;
    const riskFactor = (riskTolerance - 50) / 100;
    const adjustedReturn = baseReturn + riskFactor;
    return investmentAmount * adjustedReturn;
  };

  const investmentProgress = () => {
    const maxReturn = investmentAmount * 0.15;
    const currentReturn = investmentReturn();
    return (currentReturn / maxReturn) * 100;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Finance</h1>
            <p className="text-white/70 dark:text-foreground/70">Manage your finances and track your transactions</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-nexacore-teal/20 dark:bg-primary/20 flex items-center justify-center">
            <Wallet className="text-nexacore-teal dark:text-primary" size={24} />
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white/10 dark:bg-foreground/10 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background">Overview</TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background">Transactions</TabsTrigger>
            <TabsTrigger value="budgeting" className="data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background">Budgeting</TabsTrigger>
            <TabsTrigger value="investments" className="data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background">Investments</TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                <CardHeader>
                  <CardTitle className="text-white dark:text-card-foreground flex items-center">
                    <DollarSign className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                    Total Balance
                  </CardTitle>
                  <CardDescription className="text-white/70 dark:text-card-foreground/70">
                    Current balance across all accounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white dark:text-card-foreground">
                    ${calculateTotalBalance().toFixed(2)}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                <CardHeader>
                  <CardTitle className="text-white dark:text-card-foreground flex items-center">
                    <ArrowUpRight className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                    Total Income
                  </CardTitle>
                  <CardDescription className="text-white/70 dark:text-card-foreground/70">
                    Income from all sources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white dark:text-card-foreground">
                    ${calculateTotalIncome().toFixed(2)}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                <CardHeader>
                  <CardTitle className="text-white dark:text-card-foreground flex items-center">
                    <ArrowDownRight className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                    Total Expenses
                  </CardTitle>
                  <CardDescription className="text-white/70 dark:text-card-foreground/70">
                    Expenses from all categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white dark:text-card-foreground">
                    ${calculateTotalExpenses().toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
              <CardHeader>
                <CardTitle className="text-white dark:text-card-foreground">Financial Summary</CardTitle>
                <CardDescription className="text-white/70 dark:text-card-foreground/70">
                  Overview of your financial health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white dark:text-card-foreground">Income vs Expenses</span>
                    <LineChart className="h-6 w-6 text-nexacore-teal dark:text-primary" />
                  </div>
                  <Progress value={(calculateTotalIncome() / (calculateTotalIncome() + calculateTotalExpenses())) * 100} />

                  <div className="flex items-center justify-between">
                    <span className="text-white dark:text-card-foreground">Savings Rate</span>
                    <TrendingUp className="h-6 w-6 text-nexacore-teal dark:text-primary" />
                  </div>
                  <Progress value={((calculateTotalBalance() / calculateTotalIncome()) * 100)} />

                  <div className="flex items-center justify-between">
                    <span className="text-white dark:text-card-foreground">Debt to Income Ratio</span>
                    <CreditCard className="h-6 w-6 text-nexacore-teal dark:text-primary" />
                  </div>
                  <Progress value={50} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Input
                  placeholder="Search transactions..."
                  className="w-64 bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground"
                />
                <Button
                  variant="outline"
                  className="border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              <Button
                className="bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                onClick={() => setIsTransactionDialogOpen(true)}
              >
                Add Transaction
              </Button>
            </div>

            {transactions.length === 0 ? (
              <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                <CardContent className="flex flex-col items-center justify-center p-12">
                  <FileText className="h-16 w-16 text-white/20 dark:text-card-foreground/20 mb-4" />
                  <h3 className="text-xl font-medium text-white dark:text-card-foreground mb-2">No Transactions Yet</h3>
                  <p className="text-white/70 dark:text-card-foreground/70 text-center max-w-md mb-6">
                    You haven't added any transactions yet. Click the button above to add your first transaction.
                  </p>
                  <Button
                    className="bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                    onClick={() => setIsTransactionDialogOpen(true)}
                  >
                    Add Your First Transaction
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <Card key={transaction.id} className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-white dark:text-card-foreground flex items-center">
                            {transaction.type === "income" ? (
                              <ArrowUpRight className="mr-2 text-green-400" size={18} />
                            ) : (
                              <ArrowDownRight className="mr-2 text-red-400" size={18} />
                            )}
                            {transaction.category}
                          </CardTitle>
                          <CardDescription className="text-white/70 dark:text-card-foreground/70 flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {transaction.date}
                          </CardDescription>
                        </div>
                        <Badge className={transaction.type === "income" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2 pt-0">
                      <p className="text-sm text-white/80 dark:text-card-foreground/80">
                        {transaction.description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <div className="text-xl font-bold text-white dark:text-card-foreground">
                        ${transaction.amount.toFixed(2)}
                      </div>
                      <Button
                        variant="outline"
                        className="border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                      >
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
              <DialogContent className="sm:max-w-[425px] bg-nexacore-blue-dark/90 dark:bg-card border-white/10 dark:border-border text-white dark:text-card-foreground">
                <DialogHeader>
                  <DialogTitle>Add Transaction</DialogTitle>
                  <DialogDescription>
                    Add a new income or expense transaction to track your finances.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Select value={transactionType} onValueChange={setTransactionType} className="col-span-3">
                      <SelectTrigger className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Input
                      id="category"
                      value={transactionCategory}
                      onChange={(e) => setTransactionCategory(e.target.value)}
                      className="col-span-3 bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      value={transactionAmount}
                      onChange={(e) => setTransactionAmount(e.target.value)}
                      className="col-span-3 bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] justify-start text-left font-normal bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                          <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-nexacore-blue-dark/90 dark:bg-card border-white/10 dark:border-border">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) =>
                            date > new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="description"
                      value={transactionDescription}
                      onChange={(e) => setTransactionDescription(e.target.value)}
                      className="col-span-3 bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddTransaction} className="bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90">
                    Add Transaction
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Budgeting Tab */}
          <TabsContent value="budgeting" className="space-y-6">
            <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
              <CardHeader>
                <CardTitle className="text-white dark:text-card-foreground">Budget Overview</CardTitle>
                <CardDescription className="text-white/70 dark:text-card-foreground/70">
                  Track your spending and set budget goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white dark:text-card-foreground">Monthly Budget</span>
                    <Input
                      type="number"
                      placeholder="Enter budget amount"
                      className="w-32 bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white dark:text-card-foreground">Spending Progress</span>
                    <BarChart2 className="h-6 w-6 text-nexacore-teal dark:text-primary" />
                  </div>
                  <Progress value={60} />

                  <div className="flex items-center justify-between">
                    <span className="text-white dark:text-card-foreground">Remaining Budget</span>
                    <div className="text-xl font-bold text-white dark:text-card-foreground">$400</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
              <CardHeader>
                <CardTitle className="text-white dark:text-card-foreground">Spending Categories</CardTitle>
                <CardDescription className="text-white/70 dark:text-card-foreground/70">
                  Track your spending by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white dark:text-card-foreground">Food & Dining</span>
                    <Progress value={70} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white dark:text-card-foreground">Transportation</span>
                    <Progress value={40} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white dark:text-card-foreground">Entertainment</span>
                    <Progress value={90} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investments Tab */}
          <TabsContent value="investments" className="space-y-6">
            <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
              <CardHeader>
                <CardTitle className="text-white dark:text-card-foreground">Investment Portfolio</CardTitle>
                <CardDescription className="text-white/70 dark:text-card-foreground/70">
                  Manage your investments and track returns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white dark:text-card-foreground">Investment Amount</span>
                    <Input
                      type="number"
                      placeholder="Enter investment amount"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(parseInt(e.target.value))}
                      className="w-32 bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white dark:text-card-foreground">Risk Tolerance</span>
                    <Slider
                      defaultValue={[riskTolerance]}
                      max={100}
                      step={1}
                      onValueChange={(value) => setRiskTolerance(value[0])}
                      className="w-32"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white dark:text-card-foreground">Expected Return</span>
                    <div className="text-xl font-bold text-white dark:text-card-foreground">${investmentReturn().toFixed(2)}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white dark:text-card-foreground">Progress</span>
                    <TrendingUp className="h-6 w-6 text-nexacore-teal dark:text-primary" />
                  </div>
                  <Progress value={investmentProgress()} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
              <CardHeader>
                <CardTitle className="text-white dark:text-card-foreground">Investment Opportunities</CardTitle>
                <CardDescription className="text-white/70 dark:text-card-foreground/70">
                  Explore investment options based on your risk profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white dark:text-card-foreground">Stocks</span>
                    <Progress value={80} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white dark:text-card-foreground">Bonds</span>
                    <Progress value={50} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white dark:text-card-foreground">Real Estate</span>
                    <Progress value={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
              <CardHeader>
                <CardTitle className="text-white dark:text-card-foreground">Financial Reports</CardTitle>
                <CardDescription className="text-white/70 dark:text-card-foreground/70">
                  Generate detailed financial reports
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-12">
                <FileText className="h-16 w-16 text-white/20 dark:text-card-foreground/20 mb-4" />
                <h3 className="text-xl font-medium text-white dark:text-card-foreground mb-2">Generate Financial Reports</h3>
                <p className="text-white/70 dark:text-card-foreground/70 text-center max-w-md mb-6">
                  Generate detailed financial reports to track your income, expenses, and investments.
                </p>
                <Button className="bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90">
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// Import necessary types
import {
  Filter,
  CalendarDays
} from "lucide-react";

export default Finance;
