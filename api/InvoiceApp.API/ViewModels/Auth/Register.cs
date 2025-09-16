namespace InvoiceApp.API.ViewModels.Auth
{
    public class RegisterModel
    {
        public string Username { get; set; }   // For login
        public string Email { get; set; }      // For communication
        public string Password { get; set; }   // For login
        public string Role { get; set; }       // Optional (Admin, Manager, User etc.)
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
