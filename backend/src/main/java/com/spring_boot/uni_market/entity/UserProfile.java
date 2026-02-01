package com.spring_boot.uni_market.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_profile")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
    @JsonProperty("userId")
    @Column(name = "user_id")
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @JsonProperty("fullName")
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @JsonProperty("phone")
    private String phone;

    @JsonProperty("universityId")
    @Column(name = "university_id", unique = true)
    private String universityId;

    @JsonProperty("department")
    private String department;

    @JsonProperty("batch")
    private String batch;

    @JsonProperty("avatarUrl")
    @Column(name = "avatar_url", length = 1000)
    private String avatarUrl;
}
