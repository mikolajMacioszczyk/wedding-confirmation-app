namespace WeddingConfirmationApp.Application.Models;
public class NotFound
{
    public string Identifier { get; init; }
    public string? CustomMessage { get; init; }
    public string Message => CustomMessage ?? $"Not found entity with id = {Identifier}";
    public NotFound(string identifier, string? customMessage = null)
    {
        Identifier = identifier;
        CustomMessage = customMessage;
    }
    public NotFound(Guid identifier, string? customMessage = null)
    {
        Identifier = identifier.ToString();
        CustomMessage = customMessage;
    }
}
