namespace WeddingConfirmationApp.Application.Models;
public struct Result<T>
{
    public T? Value { get; private set; }
    public bool IsSuccess { get; private set; }
    public readonly bool IsFailure => !IsSuccess && !IsNotFound;
    public bool IsNotFound { get; private set; }
    public string ErrorMessage { get; private set; }

    private Result(T? value, bool isSuccess, bool isNotFound, string errorMessage)
    {
        Value = value;
        IsSuccess = isSuccess;
        IsNotFound = isNotFound;
        ErrorMessage = errorMessage;
    }

    public static implicit operator Result<T>(T value) => new(value, true, false, string.Empty);

    public static implicit operator Result<T>(Failure failure) => new(default, false, false, failure.Message);

    public static implicit operator Result<T>(List<Failure> failures) => new Failure(string.Join(",", failures.Select(f => f.Message)));

    public static implicit operator Result<T>(NotFound notFound) => new(default, false, true, notFound.Message);

    public static bool operator !(Result<T> result) => !result.IsSuccess;

    public readonly Result<S> MapNonSuccessfullTo<S>()
    {
        if (IsSuccess)
        {
            throw new InvalidOperationException($"Mapping Successfull result to {typeof(S)} not allowed");
        }
        return new Result<S>(default, IsSuccess, IsNotFound, ErrorMessage);
    }

    public readonly async Task<Result<S>> Then<S>(Func<T, Task<Result<S>>> func)
    {
        if (IsSuccess)
        {
            return await func(Value!);
        }
        return MapNonSuccessfullTo<S>();
    }

    public readonly Result<S> Then<S>(Func<T, Result<S>> func)
    {
        if (IsSuccess)
        {
            return func(Value!);
        }
        return MapNonSuccessfullTo<S>();
    }
}
