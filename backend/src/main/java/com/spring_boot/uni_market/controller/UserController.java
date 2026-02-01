package com.spring_boot.uni_market.controller;

import com.spring_boot.uni_market.dto.LoginDTO;
import com.spring_boot.uni_market.dto.UserRegisterDTO;
import com.spring_boot.uni_market.entity.User;
import com.spring_boot.uni_market.entity.UserProfile;
import com.spring_boot.uni_market.service.UserService;
import com.spring_boot.uni_market.utils.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@CrossOrigin(origins = "*") // Allow for frontend dev
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<StandardResponse> registerUser(@RequestBody UserRegisterDTO dto) {
        String res = userService.registerUser(dto);
        return new ResponseEntity<>(
                new StandardResponse("success", res, null, 201),
                HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<StandardResponse> loginUser(@RequestBody LoginDTO dto) {
        User user = userService.loginUser(dto);
        // Warning: Returning partial user entity directly. In prod, return a JWT +
        // minimal DTO.
        return new ResponseEntity<>(
                new StandardResponse("success", "Login Successful", user, 200),
                HttpStatus.OK);
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<StandardResponse> getUserProfile(@PathVariable Long id) {
        UserProfile profile = userService.getUserProfile(id);
        return new ResponseEntity<>(
                new StandardResponse("success", "Profile Retrieved", profile, 200),
                HttpStatus.OK);
    }

    @PutMapping("/profile/update")
    public ResponseEntity<StandardResponse> updateProfile(@RequestBody UserProfile profile) {
        String res = userService.updateProfile(profile);
        return new ResponseEntity<>(
                new StandardResponse("success", res, null, 200),
                HttpStatus.OK);
    }
}
