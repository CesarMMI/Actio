using System.ComponentModel.DataAnnotations;

namespace Actio.Application.Dtos.Auth;

public class LoginRequest
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email")]
    [MaxLength(100, ErrorMessage = "Email length can't be greater than 100")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    [MinLength(5, ErrorMessage = "Password length can't be lower than 5")]
    [MaxLength(100, ErrorMessage = "Password length can't be greater than 100")]
    public string Password { get; set; } = string.Empty;
}
