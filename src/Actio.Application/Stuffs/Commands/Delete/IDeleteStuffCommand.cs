﻿using Actio.Application.Shared.Dto;
using Actio.Application.Shared.Interfaces;
using Actio.Application.Stuffs.Shared;

namespace Actio.Application.Stuffs.Commands.Delete;

public interface IDeleteStuffCommand : ICommand<IdQuery, StuffResult>
{
}
