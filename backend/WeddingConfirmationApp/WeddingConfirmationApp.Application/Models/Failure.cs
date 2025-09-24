namespace WeddingConfirmationApp.Application.Models;
public class Failure
{
    public string Message { get; init; }

    public Failure(string message)
    {
        Message = message;
    }

    public Failure(IEnumerable<string> messages)
    {
        Message = string.Join(", ", messages);
    }
}
