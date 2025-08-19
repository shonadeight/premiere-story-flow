import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { History, ArrowUpRight, ArrowDownLeft, DollarSign, Clock, CheckCircle, XCircle, Search, Filter, Download } from "lucide-react";
import { useState } from "react";

export const TransactionsTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const transactions = [
    {
      id: "TXN001",
      type: "contribution",
      direction: "in",
      amount: 5000,
      currency: "USD",
      from: "John Smith",
      to: "Timeline Fund",
      description: "Initial funding contribution",
      date: "2024-01-15T10:30:00Z",
      status: "completed",
      category: "financial",
      reference: "REF-2024-001"
    },
    {
      id: "TXN002", 
      type: "payout",
      direction: "out",
      amount: 1250,
      currency: "USD",
      from: "Timeline Fund",
      to: "Sarah Johnson",
      description: "Q4 2023 revenue share",
      date: "2024-01-10T14:15:00Z", 
      status: "completed",
      category: "revenue_share",
      reference: "PAY-2024-001"
    },
    {
      id: "TXN003",
      type: "contribution",
      direction: "in", 
      amount: 750,
      currency: "USD",
      from: "Mike Chen",
      to: "Timeline Fund",
      description: "Consulting hours contribution",
      date: "2024-01-08T09:20:00Z",
      status: "pending",
      category: "intellectual",
      reference: "CON-2024-003"
    },
    {
      id: "TXN004",
      type: "withdrawal",
      direction: "out",
      amount: 2000,
      currency: "USD", 
      from: "Timeline Fund",
      to: "External Wallet",
      description: "Equipment purchase",
      date: "2024-01-05T16:45:00Z",
      status: "completed", 
      category: "operational",
      reference: "WTH-2024-001"
    },
    {
      id: "TXN005",
      type: "contribution",
      direction: "in",
      amount: 300,
      currency: "USD",
      from: "Alice Brown", 
      to: "Timeline Fund",
      description: "Network referral reward",
      date: "2024-01-03T11:30:00Z",
      status: "failed",
      category: "network",
      reference: "NET-2024-005"
    }
  ];

  const getTransactionIcon = (type: string, direction: string) => {
    if (direction === "in") return ArrowDownLeft;
    return ArrowUpRight;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "financial": return "bg-blue-100 text-blue-800";
      case "intellectual": return "bg-purple-100 text-purple-800";
      case "network": return "bg-orange-100 text-orange-800";
      case "revenue_share": return "bg-green-100 text-green-800";
      case "operational": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Transaction History</h3>
        </div>
        <Button variant="outline" size="sm" className="touch-manipulation">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <ArrowDownLeft className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total Inflow</p>
              <p className="text-lg font-semibold text-green-600">{formatCurrency(6050)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-red-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total Outflow</p>
              <p className="text-lg font-semibold text-red-600">{formatCurrency(3250)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Net Balance</p>
              <p className="text-lg font-semibold">{formatCurrency(2800)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              <p className="text-lg font-semibold">{transactions.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="contribution">Contributions</SelectItem>
                <SelectItem value="payout">Payouts</SelectItem>
                <SelectItem value="withdrawal">Withdrawals</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="touch-manipulation">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Transactions ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction, index) => {
              const TransactionIcon = getTransactionIcon(transaction.type, transaction.direction);
              const isInflow = transaction.direction === "in";
              
              return (
                <div key={transaction.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${isInflow ? 'bg-green-100' : 'bg-red-100'}`}>
                        <TransactionIcon className={`h-4 w-4 ${isInflow ? 'text-green-600' : 'text-red-600'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{transaction.description}</h4>
                          <Badge variant="outline" className={`text-xs ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </Badge>
                          <Badge variant="secondary" className={`text-xs ${getCategoryColor(transaction.category)}`}>
                            {transaction.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{transaction.from} → {transaction.to}</span>
                          <span>{transaction.reference}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(transaction.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${isInflow ? 'text-green-600' : 'text-red-600'}`}>
                        {isInflow ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
                      </div>
                    </div>
                  </div>
                  {index < filteredTransactions.length - 1 && <Separator className="mt-4" />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};