using Microsoft.AspNetCore.Identity;

public class ApplicationUser : IdentityUser
{
    // Add custom fields if needed
    public string FirstName { get; set; }  // Not nullable
    public string LastName { get; set; }   // Not nullable
}
