﻿namespace Actio.Application.Auth.Queries;

public readonly struct RegisterQuery
{
    public string? Name { get; init; }
    public string? Email { get; init; }
    public string? Password { get; init; }
}
