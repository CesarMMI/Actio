namespace Actio.Domain.Models;

public class StuffAction
{
    public int Id { get; set; }

    public bool Done { get; set; } = false;
    public DateTime? DoneAt { get; set; }
    public int? RequiredEnergy { get; set; }
    public int? EstimatedTimeMins { get; set; }

    public int StuffId { get; set; }
    public Stuff Stuff { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
