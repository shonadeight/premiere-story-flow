import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Calculator, TrendingUp, TrendingDown, DollarSign, Users, Brain, Lightbulb, Calendar, Target, BarChart3 } from "lucide-react";
import { ContributionBreakdown } from "../ContributionBreakdown";

export const ValuationTab = () => {
  const currentValuation = {
    total: 285000,
    change: 12.5,
    changeAmount: 31750,
    lastUpdated: "2024-01-15",
    method: "Hybrid Model"
  };

  const valuationBreakdown = [
    {
      category: "Financial Capital",
      value: 125000,
      percentage: 43.9,
      change: 8.2,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
      contributions: [
        { type: "Cash Investments", amount: 85000 },
        { type: "Asset Contributions", amount: 40000 }
      ]
    },
    {
      category: "Network Capital", 
      value: 85000,
      percentage: 29.8,
      change: 15.3,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      contributions: [
        { type: "Referral Network", amount: 45000 },
        { type: "Partnership Value", amount: 25000 },
        { type: "Community Building", amount: 15000 }
      ]
    },
    {
      category: "Intellectual Capital",
      value: 55000,
      percentage: 19.3,
      change: 22.1,
      icon: Brain,
      color: "text-purple-600", 
      bgColor: "bg-purple-100",
      contributions: [
        { type: "IP & Patents", amount: 30000 },
        { type: "Consulting Hours", amount: 15000 },
        { type: "Research & Development", amount: 10000 }
      ]
    },
    {
      category: "Innovation Capital",
      value: 20000,
      percentage: 7.0,
      change: 5.8,
      icon: Lightbulb,
      color: "text-orange-600",
      bgColor: "bg-orange-100", 
      contributions: [
        { type: "Process Innovation", amount: 12000 },
        { type: "Technology Stack", amount: 8000 }
      ]
    }
  ];

  const valuationHistory = [
    { date: "Jan 2024", value: 285000, method: "Hybrid Model" },
    { date: "Dec 2023", value: 268000, method: "Hybrid Model" },
    { date: "Nov 2023", value: 245000, method: "Asset-based" },
    { date: "Oct 2023", value: 225000, method: "Market Multiple" },
    { date: "Sep 2023", value: 210000, method: "Asset-based" },
    { date: "Aug 2023", value: 195000, method: "Market Multiple" }
  ];

  const methodsUsed = [
    {
      name: "Market Multiple",
      weight: 40,
      value: 114000,
      description: "Based on comparable timeline valuations in similar sectors"
    },
    {
      name: "Asset-Based", 
      weight: 35,
      value: 99750,
      description: "Sum of all contributed assets at current market value"
    },
    {
      name: "Revenue Multiple",
      weight: 15,
      value: 42750,
      description: "Projected revenue streams multiplied by industry averages"
    },
    {
      name: "Network Effect",
      weight: 10,
      value: 28500,
      description: "Value derived from network connections and partnerships"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Valuation Breakdown</h3>
        </div>
        <Button variant="outline" size="sm" className="touch-manipulation">
          <Target className="h-4 w-4 mr-2" />
          Revalue Timeline
        </Button>
      </div>

      {/* Current Valuation Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current Valuation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold">{formatCurrency(currentValuation.total)}</div>
              <div className="flex items-center gap-2 mt-1">
                {currentValuation.change >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${currentValuation.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {currentValuation.change >= 0 ? '+' : ''}{currentValuation.change}% 
                  ({currentValuation.change >= 0 ? '+' : ''}{formatCurrency(currentValuation.changeAmount)})
                </span>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="mb-2">{currentValuation.method}</Badge>
              <div className="text-sm text-muted-foreground">
                Last updated: {currentValuation.lastUpdated}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Valuation Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Capital Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {valuationBreakdown.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${item.bgColor}`}>
                        <Icon className={`h-4 w-4 ${item.color}`} />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.category}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{item.percentage}%</span>
                          <span className={`flex items-center gap-1 ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {item.change}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(item.value)}</div>
                    </div>
                  </div>
                  
                  <Progress value={item.percentage} className="h-2" />
                  
                  <div className="space-y-1">
                    {item.contributions.map((contribution, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{contribution.type}</span>
                        <span className="font-medium">{formatCurrency(contribution.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Contribution Breakdown Component */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contribution Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ContributionBreakdown compact={false} />
        </CardContent>
      </Card>

      {/* Valuation Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Valuation Methods Used</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {methodsUsed.map((method, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{method.name}</h4>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{method.weight}%</div>
                    <div className="text-sm text-muted-foreground">{formatCurrency(method.value)}</div>
                  </div>
                </div>
                <Progress value={method.weight} className="h-2" />
                {index < methodsUsed.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Valuation History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Valuation History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {valuationHistory.map((entry, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{entry.date}</div>
                      <div className="text-sm text-muted-foreground">Method: {entry.method}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(entry.value)}</div>
                    {index > 0 && (
                      <div className={`text-sm flex items-center gap-1 ${
                        entry.value >= valuationHistory[index - 1].value ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {entry.value >= valuationHistory[index - 1].value ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {(((entry.value - valuationHistory[index - 1].value) / valuationHistory[index - 1].value) * 100).toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
                {index < valuationHistory.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};