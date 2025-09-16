using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using InvoiceApp.API.Data;

using InvoiceApp.API.Model;
using InvoiceApp.API.Enums;
using InvoiceApp.API.Common;
using InvoiceApp.API;

namespace API.Processor.Expense
{
    public class ExpenseProcessor : IProcessor<ExpenseBaseModel>
    {
        private readonly AppDbContext _context;
        private readonly IManager? _manager;

        public ExpenseProcessor(AppDbContext context)
        {
            _context = context;
            _manager = Builder.MakeManagerClass(ModuleClassName.Expense, _context);
        }

        // ✅ Get all expenses
        public async Task<ApiResponse> ProcessGet(ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();

            if (_manager != null)
            {
                var response = await _manager.GetAllAsync(_User);
                var _Table = response.data as IEnumerable<InvoiceApp.API.Models.Expense>;

                if (Convert.ToInt32(response.statusCode) == 200 && _Table != null)
                {
                    var result = (from exp in _Table
                                  select new ExpenseViewModel
                                  {
                                      Id = exp.Id,
                                      Title = exp.Title,
                                      Amount = exp.Amount,
                                      ExpenseNumber = exp.ExpenseNumber,
                                      ExpenseDate = exp.ExpenseDate,
                                      PaymentMethod = exp.PaymentMethod,
                                      Category = exp.Category,
                                      Notes = exp.Notes,
                                      //CreatedAt = exp.CreatedAt,
                                      //CreatedBy = exp.CreatedBy,
                                      //UpdatedAt = exp.UpdatedAt,
                                      //UpdatedBy = exp.UpdatedBy
                                  }).ToList();

                    response.data = result;
                }

                return response;
            }

            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
            apiResponse.message = "Manager not initialized or Invalid Class.";
            return apiResponse;
        }

        // ✅ Get expense by Id
        public async Task<ApiResponse> ProcessGetById(Guid _Id, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();

            if (_manager != null)
            {
                var response = await _manager.GetByIdAsync(_Id, _User);
                if (Convert.ToInt32(response.statusCode) == 200)
                {
                    var exp = response.data as InvoiceApp.API.Models.Expense;
                    if (exp != null)
                    {
                        var viewModel = new ExpenseViewByIdModel
                        {
                            Id = exp.Id,
                            Title = exp.Title,
                            Amount = exp.Amount,
                            ExpenseNumber = exp.ExpenseNumber,
                            ExpenseDate = exp.ExpenseDate,
                            PaymentMethod = exp.PaymentMethod,
                            Category = exp.Category,
                            Notes = exp.Notes,
                            //CreatedAt = exp.CreatedAt,
                            //CreatedBy = exp.CreatedBy,
                            //UpdatedAt = exp.UpdatedAt,
                            //UpdatedBy = exp.UpdatedBy
                        };

                        response.data = viewModel;
                    }
                }

                return response;
            }

            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
            apiResponse.message = "Manager not initialized or Invalid Class.";
            return apiResponse;
        }

        // ✅ Create new expense
        public async Task<ApiResponse> ProcessPost(ExpenseBaseModel _Expense, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();

            var expenseModel = _Expense as ExpenseAddModel;
            if (expenseModel == null)
            {
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                apiResponse.message = "Invalid Class: Expected ExpenseAddModel.";
                return apiResponse;
            }

            if (_manager is ExpenseManager expenseManager)
            {
                // generate expense number automatically
                var lastExpense = await _context.Expenses
                    .Where(e => e.ExpenseNumber != null)
                    .OrderByDescending(e => e.CreatedAt)
                    .FirstOrDefaultAsync();

                int newNumber = 1;
                if (lastExpense != null && int.TryParse(lastExpense.ExpenseNumber, out int lastNum))
                {
                    newNumber = lastNum + 1;
                }

                expenseModel.ExpenseNumber = newNumber.ToString("D5"); // e.g., 00001, 00002

                return await expenseManager.CreateAsync(expenseModel, _User);
            }

            apiResponse.statusCode = StatusCodes.Status500InternalServerError.ToString();
            apiResponse.message = "Manager not initialized or is not an ExpenseManager.";
            return apiResponse;
        }

        // ✅ Update expense
        public async Task<ApiResponse> ProcessPut(ExpenseBaseModel _Expense, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();

            var expenseUpdateModel = _Expense as ExpenseUpdateModel;
            if (expenseUpdateModel == null)
            {
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                apiResponse.message = "Invalid Class: Expected ExpenseUpdateModel.";
                return apiResponse;
            }

            if (_manager is ExpenseManager expenseManager)
            {
                return await expenseManager.UpdateAsync(expenseUpdateModel, _User);
            }

            apiResponse.statusCode = StatusCodes.Status500InternalServerError.ToString();
            apiResponse.message = "Manager not initialized or is not an ExpenseManager.";
            return apiResponse;
        }

        // ✅ Delete expense
        public async Task<ApiResponse> ProcessDelete(Guid _Id, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();

            if (_manager != null)
            {
                return await _manager.DeleteAsync(_Id, _User);
            }

            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
            apiResponse.message = "Manager not initialized or Invalid Class.";
            return apiResponse;
        }

        public Task<byte[]> GenerateCsv(ClaimsPrincipal _User)
        {
            throw new NotImplementedException();
        }
    }
}
