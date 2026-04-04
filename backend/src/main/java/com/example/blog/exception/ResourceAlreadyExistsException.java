package com.example.blog.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.CONFLICT, reason = "username already exists")
public class ResourceAlreadyExistsException extends RuntimeException {
}