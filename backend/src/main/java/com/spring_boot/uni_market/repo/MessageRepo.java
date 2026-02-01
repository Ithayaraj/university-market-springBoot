package com.spring_boot.uni_market.repo;

import com.spring_boot.uni_market.entity.Message;
import com.spring_boot.uni_market.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepo extends JpaRepository<Message, Long> {
    List<Message> findByConversation(Conversation conversation);
}
