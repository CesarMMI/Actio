using System.ComponentModel.DataAnnotations;

namespace Actio.Application.Auth.Dtos;

public class RefreshRequest
{
    [Required]
    public int UserId { get; set; }
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}
