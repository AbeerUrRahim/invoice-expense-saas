using InvoiceApp.API.Data;
using InvoiceApp.API.Model;
using InvoiceApp.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

public class ExpenseManager : IManager
{
    private readonly AppDbContext _context;

    public ExpenseManager(AppDbContext context)
    {
        _context = context;
    }

    // ✅ Get All Expenses
    public async Task<ApiResponse> GetAllAsync(ClaimsPrincipal _User)
    {
        var apiResponse = new ApiResponse();
        try
        {
            var expenses = await _context.Expenses
                .Where(e => e.Action != "D")
                .ToListAsync();

            if (expenses == null || expenses.Count == 0)
            {
                apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
                apiResponse.message = "No record found";
                return apiResponse;
            }

            apiResponse.statusCode = StatusCodes.Status200OK.ToString();
            apiResponse.data = expenses;
            return apiResponse;
        }
        catch (Exception e)
        {
            string innerexp = e.InnerException == null ? e.Message : e.Message + " Inner Error : " + e.InnerException.ToString();
            apiResponse.statusCode = StatusCodes.Status500InternalServerError.ToString();
            apiResponse.message = innerexp;
            return apiResponse;
        }
    }

    // ✅ Get Expense By Id
    public async Task<ApiResponse> GetByIdAsync(Guid id, ClaimsPrincipal _User)
    {
        var apiResponse = new ApiResponse();
        try
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null || expense.Action == "D")
            {
                apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
                apiResponse.message = "Expense not found";
                return apiResponse;
            }

            apiResponse.statusCode = StatusCodes.Status200OK.ToString();
            apiResponse.data = expense;
            return apiResponse;
        }
        catch (Exception e)
        {
            string innerexp = e.InnerException == null ? e.Message : e.Message + " Inner Error : " + e.InnerException.ToString();
            apiResponse.statusCode = StatusCodes.Status500InternalServerError.ToString();
            apiResponse.message = innerexp;
            return apiResponse;
        }
    }

    // ✅ Create Expense (Admin Only)
    public async Task<ApiResponse> CreateAsync(object model, ClaimsPrincipal _User)
    {
        var expenseModel = model as ExpenseAddModel; // define this DTO like InvoiceAddModel
        var apiResponse = new ApiResponse();
        var userId = _User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!_User.IsInRole("Admin"))
        {
            apiResponse.statusCode = StatusCodes.Status401Unauthorized.ToString();
            apiResponse.message = "Only admin can create expenses";
            return apiResponse;
        }

        if (expenseModel == null)
        {
            apiResponse.statusCode = StatusCodes.Status400BadRequest.ToString();
            apiResponse.message = "Invalid model: Expected ExpenseAddModel";
            return apiResponse;
        }

        if (expenseModel.Amount < 0)
        {
            apiResponse.statusCode = StatusCodes.Status400BadRequest.ToString();
            apiResponse.message = "Invalid amount";
            return apiResponse;
        }

        bool titleExist = await _context.Expenses.AnyAsync(e => e.Title.Trim() == expenseModel.Title);
        if (titleExist)
        {
            apiResponse.statusCode = StatusCodes.Status409Conflict.ToString();
            apiResponse.message = "Title already exists";
            apiResponse.error = new List<string> { "Title already exist"};

            return apiResponse;
        }

        var expense = new Expense
        {
            Id = Guid.NewGuid(),
            Title = expenseModel.Title,
            Amount = expenseModel.Amount,
            ExpenseNumber = expenseModel.ExpenseNumber, // you can auto-generate here if needed
            ExpenseDate = expenseModel.ExpenseDate,
            Category = expenseModel.Category,
            PaymentMethod = expenseModel.PaymentMethod,
            Notes = expenseModel.Notes,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = userId,
            Action = "A"
        };

        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();

        apiResponse.statusCode = StatusCodes.Status200OK.ToString();
        apiResponse.message = "Expense created successfully";
        return apiResponse;
    }

    // ✅ Update Expense
    public async Task<ApiResponse> UpdateAsync(object model, ClaimsPrincipal _User)
    {
        var expenseModel = model as ExpenseUpdateModel; // define this DTO like InvoiceUpdateModel
        var apiResponse = new ApiResponse();
        var userId = _User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!_User.IsInRole("Admin"))
        {
            apiResponse.statusCode = StatusCodes.Status401Unauthorized.ToString();
            apiResponse.message = "Only admin can update expenses";
            return apiResponse;
        }

        if (expenseModel == null)
        {
            apiResponse.statusCode = StatusCodes.Status400BadRequest.ToString();
            apiResponse.message = "Invalid model: Expected ExpenseUpdateModel";
            return apiResponse;
        }

        var expense = await _context.Expenses.FirstOrDefaultAsync(e => e.Id == expenseModel.Id);
        if (expense == null || expense.Action == "D")
        {
            apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
            apiResponse.message = "Expense not found";
            return apiResponse;
        }

        bool titleExist = await _context.Expenses
            .AnyAsync(e => e.Title.Trim() == expenseModel.Title && e.Id != expenseModel.Id);
        if (titleExist)
        {
            apiResponse.statusCode = StatusCodes.Status409Conflict.ToString();
            apiResponse.message = "Title already exists";
            return apiResponse;
        }

        expense.Title = expenseModel.Title;
        expense.Amount = expenseModel.Amount;
        expense.ExpenseDate = expenseModel.ExpenseDate;
        expense.Category = expenseModel.Category;
        expense.PaymentMethod = expenseModel.PaymentMethod;
        expense.Notes = expenseModel.Notes;
        expense.UpdatedAt = DateTime.UtcNow;
        expense.UpdatedBy = userId;
        expense.Action = expenseModel.Action;

        _context.Expenses.Update(expense);
        await _context.SaveChangesAsync();

        apiResponse.statusCode = StatusCodes.Status200OK.ToString();
        apiResponse.message = "Expense updated successfully";
        return apiResponse;
    }

    // ✅ Delete Expense (soft delete)
    public async Task<ApiResponse> DeleteAsync(Guid id, ClaimsPrincipal _User)
    {
        var apiResponse = new ApiResponse();
        var userId = _User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!_User.IsInRole("Admin"))
        {
            apiResponse.statusCode = StatusCodes.Status401Unauthorized.ToString();
            apiResponse.message = "Only admin can delete expenses";
            return apiResponse;
        }

        var expense = await _context.Expenses.FindAsync(id);
        if (expense == null || expense.Action == "D")
        {
            apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
            apiResponse.message = "Expense not found";
            return apiResponse;
        }

        expense.Action = "D";
        expense.DeletedAt = DateTime.UtcNow;
        expense.DeletedBy = userId;

        _context.Expenses.Update(expense);
        await _context.SaveChangesAsync();

        apiResponse.statusCode = StatusCodes.Status200OK.ToString();
        apiResponse.message = "Expense deleted successfully";
        return apiResponse;
    }
}
