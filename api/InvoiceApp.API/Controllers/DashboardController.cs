using InvoiceApp.API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InvoiceApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboardData()
        {
            var totalInvoices = await _context.Invoices
    .Where(i => i.Action != "D")
    .CountAsync();

            var totalExpenses = await _context.Expenses
                .Where(e => e.Action != "D")
                .SumAsync(e => (decimal?)e.Amount) ?? 0;

            var totalRevenue = await _context.Invoices
                .Where(i => i.Action != "D")
                .SumAsync(i => (decimal?)i.Amount) ?? 0;

            var monthlyBalance = totalRevenue - totalExpenses;


            // Group income & expenses by month
            var chartData = await _context.Invoices
                .GroupBy(i => i.InvoiceDate.Month)
                .Select(g => new
                {
                    month = g.Key,
                    income = g.Sum(x => x.Amount)
                }).ToListAsync();

            var expenseData = await _context.Expenses
                .GroupBy(e => e.ExpenseDate.Month)
                .Select(g => new
                {
                    month = g.Key,
                    expenses = g.Sum(x => x.Amount)
                }).ToListAsync();

            var mergedData = (from i in chartData
                              join e in expenseData on i.month equals e.month into gj
                              from sube in gj.DefaultIfEmpty()
                              select new
                              {
                                  month = System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(i.month),
                                  income = i.income,
                                  expenses = sube?.expenses ?? 0
                              }).ToList();

            var recentInvoices = await _context.Invoices
                .OrderByDescending(i => i.InvoiceDate)
                .Take(5)
                .Select(i => new { i.InvoiceNumber, i.CustomerName, i.Amount, i.Remarks })
                .ToListAsync();

            var recentExpenses = await _context.Expenses
                .OrderByDescending(e => e.ExpenseDate)
                .Take(5)
                .Select(e => new { e.Id, e.Category, e.Amount, e.ExpenseDate })
                .ToListAsync();

            return Ok(new
            {
                stats = new
                {
                    totalInvoices,
                    totalExpenses,
                    revenue = totalRevenue,
                    monthlyBalance
                },
                chartData = mergedData,
                recentInvoices,
                recentExpenses
            });
        }
    }

}
