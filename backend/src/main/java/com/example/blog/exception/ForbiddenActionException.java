package com.example.blog.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.FORBIDDEN)
public class ForbiddenActionException extends RuntimeException {
    public ForbiddenActionException() {
        super("You do not have permission to perform this action");
    }

    public ForbiddenActionException(String message) {
        super(message);
    }
}