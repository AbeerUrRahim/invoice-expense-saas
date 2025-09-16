using API.Processor;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Expense
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Authorize] // ✅ Protects all routes with JWT
    public class ExpenseController : ControllerBase
    {
        private readonly IProcessor<ExpenseBaseModel> _IProcessor;

        public ExpenseController(IProcessor<ExpenseBaseModel> IProcessor)
        {
            _IProcessor = IProcessor;
        }

        // ✅ Get all expenses
        [HttpGet]
        [Route("GetExpense")]
        public async Task<IActionResult> GetExpense()
        {
            try
            {
                var result = await _IProcessor.ProcessGet(User);
                return Ok(result);
            }
            catch (Exception e)
            {
                string innerexp = e.InnerException != null ? " Inner Error: " + e.InnerException.ToString() : "";
                return BadRequest(e.Message + innerexp);
            }
        }

        // ✅ Get expense by Id
        [HttpGet]
        [Route("GetExpenseById/{id}")]
        public async Task<IActionResult> GetExpenseById(Guid id)
        {
            try
            {
                var result = await _IProcessor.ProcessGetById(id, User);
                return Ok(result.data);
            }
            catch (Exception e)
            {
                string innerexp = e.InnerException != null ? " Inner Error: " + e.InnerException.ToString() : "";
                return BadRequest(e.Message + innerexp);
            }
        }

        // ✅ Add new expense
        [HttpPost]
        [Route("AddExpense")]
        public async Task<IActionResult> AddExpense(ExpenseAddModel expense)
        {
            try
            {
                var result = await _IProcessor.ProcessPost(expense, User);
                return Ok(result);
            }
            catch (Exception e)
            {
                string innerexp = e.InnerException != null ? " Inner Error: " + e.InnerException.ToString() : "";
                return BadRequest(e.Message + innerexp);
            }
        }

        // ✅ Update expense
        [HttpPut]
        [Route("UpdateExpense")]
        public async Task<IActionResult> UpdateExpense(ExpenseUpdateModel expense)
        {
            try
            {
                var result = await _IProcessor.ProcessPut(expense, User);
                return Ok(result);
            }
            catch (Exception e)
            {
                string innerexp = e.InnerException != null ? " Inner Error: " + e.InnerException.ToString() : "";
                return BadRequest(e.Message + innerexp);
            }
        }

        // ✅ Delete expense
        [HttpDelete]
        [Route("DeleteExpense/{id}")]
        public async Task<IActionResult> DeleteExpense(Guid id)
        {
            try
            {
                var result = await _IProcessor.ProcessDelete(id, User);
                return Ok(result);
            }
            catch (Exception e)
            {
                string innerexp = e.InnerException != null ? " Inner Error: " + e.InnerException.ToString() : "";
                return BadRequest(e.Message + innerexp);
            }
        }
    }
}
