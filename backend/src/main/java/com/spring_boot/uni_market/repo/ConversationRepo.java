package com.spring_boot.uni_market.repo;

import com.spring_boot.uni_market.entity.Conversation;
import com.spring_boot.uni_market.entity.User;
import com.spring_boot.uni_market.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepo extends JpaRepository<Conversation, Long> {

    Optional<Conversation> findByBuyerAndSellerAndProduct(User buyer, User seller, Product product);

    @Query("SELECT c FROM Conversation c WHERE c.buyer = :user OR c.seller = :user")
    List<Conversation> findByUser(User user);
}
