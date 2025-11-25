package edu.uth.warranty.exception;

import edu.uth.warranty.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler; 
import org.springframework.web.bind.annotation.ResponseStatus; // Thêm import này

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Bắt lỗi Validation (@Valid, @NotNull, @NotBlank) -> 400 Bad Request
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST) // Đảm bảo trả về 400
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            // Lấy tên trường và thông báo lỗi
            errors.put(error.getField(), error.getDefaultMessage());
        });
        
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
    
    /**
     * Bắt lỗi Logic Nghiệp vụ (được ném từ Service Layer) -> 400 Bad Request
     */
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST) // Đảm bảo trả về 400
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "Bad Request (Business Logic)",
            ex.getMessage(),
            null
        ); 
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
    
    // Thêm một handler cho các lỗi chung, nếu lỗi không phải IllegalArgument/Validation
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception ex) {
        // Chỉ để log chi tiết lỗi nếu không tìm thấy nguyên nhân rõ ràng
        System.err.println("UNHANDLED SERVER ERROR: " + ex.getMessage());
        ex.printStackTrace();
        
        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Internal Server Error (General)",
            "Đã xảy ra lỗi không xác định ở Server: " + ex.getMessage(),
            null
        ); 
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}