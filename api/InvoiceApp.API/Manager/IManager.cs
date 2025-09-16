using InvoiceApp.API.Model;
using System.Security.Claims;

public interface IManager
{
    Task<ApiResponse> GetAllAsync(ClaimsPrincipal _User);
    Task<ApiResponse> GetByIdAsync(Guid id , ClaimsPrincipal _User);
    Task<ApiResponse> CreateAsync(object model, ClaimsPrincipal _User );
    Task<ApiResponse> UpdateAsync(object model, ClaimsPrincipal _User);

    //Task<ApiResponse> UpdateAsync(Guid id,object model, ClaimsPrincipal _User);
    Task<ApiResponse> DeleteAsync(Guid id, ClaimsPrincipal _User);
}
