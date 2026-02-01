package com.spring_boot.uni_market.service;

import com.spring_boot.uni_market.dto.LoginDTO;
import com.spring_boot.uni_market.dto.UserRegisterDTO;
import com.spring_boot.uni_market.entity.User;
import com.spring_boot.uni_market.entity.UserProfile;
import com.spring_boot.uni_market.enums.UserStatus;
import com.spring_boot.uni_market.repo.UserProfileRepo;
import com.spring_boot.uni_market.repo.UserRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private UserProfileRepo userProfileRepo;

    public String registerUser(UserRegisterDTO dto) {
        if (userRepo.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already active");
        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPasswordHash(dto.getPassword());
        user.setRole(dto.getRole());
        user.setStatus(UserStatus.ACTIVE);

        User savedUser = userRepo.save(user);

        UserProfile profile = new UserProfile();
        profile.setUser(savedUser);
        profile.setFullName(dto.getFullName());
        profile.setPhone(dto.getPhone());
        profile.setUniversityId(dto.getUniversityId());
        profile.setDepartment(dto.getDepartment());
        profile.setBatch(dto.getBatch());

        userProfileRepo.save(profile);

        return "User Registered Successfully with ID: " + savedUser.getUserId();
    }

    public User loginUser(LoginDTO loginDTO) {
        Optional<User> userOpt = userRepo.findByEmail(loginDTO.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPasswordHash().equals(loginDTO.getPassword())) {
                return user;
            } else {
                throw new RuntimeException("Invalid Credentials");
            }
        }
        throw new RuntimeException("User not found");
    }

    public UserProfile getUserProfile(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return userProfileRepo.findByUser(user).orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    public String updateProfile(UserProfile updatedProfile) {
        UserProfile existingProfile = userProfileRepo.findById(updatedProfile.getUserId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // Update only relevant fields
        existingProfile.setFullName(updatedProfile.getFullName());
        existingProfile.setPhone(updatedProfile.getPhone());
        existingProfile.setUniversityId(updatedProfile.getUniversityId());
        existingProfile.setDepartment(updatedProfile.getDepartment());
        existingProfile.setBatch(updatedProfile.getBatch());
        existingProfile.setAvatarUrl(updatedProfile.getAvatarUrl());

        userProfileRepo.save(existingProfile);
        return "Profile Updated Successfully";
    }
}
