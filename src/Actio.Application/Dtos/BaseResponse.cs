﻿namespace Actio.Application.Dtos;

public class BaseResponse<T>
{
    public string? Message { get; set; }
    public T? Data { get; set; }
}
