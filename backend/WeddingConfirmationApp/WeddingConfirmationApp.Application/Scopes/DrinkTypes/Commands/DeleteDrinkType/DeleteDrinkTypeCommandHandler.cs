using MediatR;
using WeddingConfirmationApp.Application.Contracts;
using WeddingConfirmationApp.Application.Models;

namespace WeddingConfirmationApp.Application.Scopes.DrinkTypes.Commands.DeleteDrinkType;

public class DeleteDrinkTypeCommandHandler : IRequestHandler<DeleteDrinkTypeCommand, Result<Empty>>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteDrinkTypeCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Empty>> Handle(DeleteDrinkTypeCommand request, CancellationToken cancellationToken)
    {
        var drinkType = await _unitOfWork.DrinkTypeRepository.GetByIdAsync(request.Id);
        
        if (drinkType is null)
            return new NotFound<Empty>();
        
        await _unitOfWork.DrinkTypeRepository.DeleteAsync(drinkType);
        
        var (changesMade, entitiesWithErrors) = await _unitOfWork.SaveChangesAsync();
        
        if (!changesMade || entitiesWithErrors.Any())
            return new Failure<Empty>("Failed to delete drink type");
        
        return new Result<Empty>(new Empty());
    }
}