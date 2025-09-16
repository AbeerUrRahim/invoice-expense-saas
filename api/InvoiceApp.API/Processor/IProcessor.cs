using System;
using System.Security.Claims;
using InvoiceApp.API.Model;

namespace API.Processor
{
    public interface IProcessor<T>
    {
        Task<ApiResponse> ProcessGet( ClaimsPrincipal _User);
        Task<ApiResponse> ProcessGetById(Guid _Id,  ClaimsPrincipal _User);
        Task<ApiResponse> ProcessPost(T model, ClaimsPrincipal _User);
        Task<ApiResponse> ProcessPut(T model, ClaimsPrincipal _User);
        Task<ApiResponse> ProcessDelete(Guid _Id, ClaimsPrincipal _User);
        Task<Byte[]> GenerateCsv(ClaimsPrincipal _User);
    }
}