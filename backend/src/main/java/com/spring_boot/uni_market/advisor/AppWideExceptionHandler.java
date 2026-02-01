package com.spring_boot.uni_market.advisor;

import com.spring_boot.uni_market.utils.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AppWideExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<StandardResponse> handleException(Exception e) {
        return new ResponseEntity<>(
                new StandardResponse("error", e.getMessage(), null, 500),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
