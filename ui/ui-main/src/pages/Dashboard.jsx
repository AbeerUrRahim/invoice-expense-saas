import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Receipt, DollarSign, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchDashboardData } from "./Api";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("token");
        const data = await fetchDashboardData(token);

        // stats cards
        setStats([
          {
            title: "Total Invoices",
            value: data.stats.totalInvoices,
            description: "+12% from last month",
            icon: FileText,
          },
          {
            title: "Total Expenses",
            value: `$${data.stats.totalExpenses}`,
            description: "+8% from last month",
            icon: Receipt,
          },
          {
            title: "Revenue",
            value: `$${data.stats.revenue}`,
            description: "+15% from last month",
            icon: DollarSign,
          },
          {
            title: "Monthly Balance",
            value: `$${data.stats.monthlyBalance}`,
            description: "+7% from last month",
            icon: TrendingUp,
          },
        ]);

        setChartData(data.chartData);
        setRecentInvoices(data.recentInvoices);
        setRecentExpenses(data.recentExpenses);
      } catch (err) {
        console.error(err);
      }
    }

    loadData();
  }, []);

  // badge color helper
  const getStatusStyles = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Welcome back! Here's an overview of your business.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <p className="text-xs text-success">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            Monthly Income vs Expenses
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Comparison of income and expenses over the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 sm:h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="income"
                  fill="hsl(var(--primary))"
                  name="Income"
                />
                <Bar
                  dataKey="expenses"
                  fill="hsl(var(--destructive))"
                  name="Expenses"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Invoices & Expenses */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>Latest invoice activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.map((invoice, idx) => (
                <div
                  key={invoice.invoiceNumber || idx}
                  className="flex items-center justify-between p-3 bg-accent rounded-lg"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {invoice.invoiceNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.customerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      ${invoice.amount}
                    </p>
<Badge
  style={{
    backgroundColor:
      invoice.remarks === "Paid"
        ? "#d1fae5" // green
        : invoice.remarks === "Pending"
        ? "#fef3c7" // yellow
        : invoice.remarks === "Overdue"
        ? "#fee2e2" // red
        : "#f3f4f6", // gray
    color:
      invoice.remarks === "Paid"
        ? "#065f46"
        : invoice.remarks === "Pending"
        ? "#92400e"
        : invoice.remarks === "Overdue"
        ? "#991b1b"
        : "#374151",
  }}
  className="px-3 py-1 rounded-full text-xs font-semibold inline-block"
>
  {invoice.remarks}
</Badge>

                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Latest expense entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExpenses.map((expense, idx) => (
                <div
                  key={expense.id || idx}
                  className="flex items-center justify-between p-3 bg-accent rounded-lg"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {expense.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      ${expense.amount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {expense.expenseDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
