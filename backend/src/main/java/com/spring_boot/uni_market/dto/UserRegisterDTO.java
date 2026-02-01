package com.spring_boot.uni_market.dto;

import com.spring_boot.uni_market.enums.Role;
import lombok.Data;

@Data
public class UserRegisterDTO {
    private String email;
    private String password;
    private Role role;
    private String fullName;
    private String phone;
    private String universityId;
    private String department;
    private String batch;
}
