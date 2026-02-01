package com.spring_boot.uni_market.repo;

import com.spring_boot.uni_market.entity.UserProfile;
import com.spring_boot.uni_market.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserProfileRepo extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUser(User user);
}
