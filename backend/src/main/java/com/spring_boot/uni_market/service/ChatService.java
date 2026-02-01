package com.spring_boot.uni_market.service;

import com.spring_boot.uni_market.dto.ConversationDTO;
import com.spring_boot.uni_market.dto.MessageDTO;
import com.spring_boot.uni_market.entity.Conversation;
import com.spring_boot.uni_market.entity.Message;
import com.spring_boot.uni_market.entity.Product;
import com.spring_boot.uni_market.entity.User;
import com.spring_boot.uni_market.repo.ConversationRepo;
import com.spring_boot.uni_market.repo.MessageRepo;
import com.spring_boot.uni_market.repo.ProductRepo;
import com.spring_boot.uni_market.repo.UserProfileRepo;
import com.spring_boot.uni_market.repo.UserRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ChatService {

    @Autowired
    private ConversationRepo conversationRepo;
    @Autowired
    private MessageRepo messageRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private ProductRepo productRepo;
    @Autowired
    private UserProfileRepo userProfileRepo;

    public String sendMessage(MessageDTO dto) {
        User sender = userRepo.findById(dto.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepo.findById(dto.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));
        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Conversation conversation = conversationRepo.findByBuyerAndSellerAndProduct(sender, receiver, product)
                .or(() -> conversationRepo.findByBuyerAndSellerAndProduct(receiver, sender, product))
                .orElseGet(() -> {
                    Conversation newConv = new Conversation();
                    newConv.setBuyer(sender); // Assuming sender initiates interaction usually
                    newConv.setSeller(receiver);
                    newConv.setProduct(product);
                    return conversationRepo.save(newConv);
                });

        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(sender);
        message.setContent(dto.getContent());
        message.setSentAt(LocalDateTime.now());

        messageRepo.save(message);

        return "Message Sent";
    }

    public List<MessageDTO> getMessages(Long conversationId) {
        Conversation conversation = conversationRepo.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        return messageRepo.findByConversation(conversation).stream().map(m -> {
            MessageDTO dto = new MessageDTO();
            dto.setMessageId(m.getMessageId());
            dto.setSenderId(m.getSender().getUserId());
            dto.setContent(m.getContent());
            dto.setSentAt(m.getSentAt());
            dto.setRead(m.isRead());
            return dto;
        }).collect(Collectors.toList());
    }

    public List<ConversationDTO> getConversationsForUser(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Conversation> conversations = conversationRepo.findByUser(user);

        return conversations.stream().map(c -> {
            ConversationDTO dto = new ConversationDTO();
            dto.setConversationId(c.getConversationId());

            User otherUser = c.getBuyer().getUserId().equals(userId) ? c.getSeller() : c.getBuyer();
            dto.setOtherUserId(otherUser.getUserId());

            // Fix: Use UserProfile full name instead of email
            String otherUserName = userProfileRepo.findByUser(otherUser)
                    .map(profile -> profile.getFullName())
                    .orElse("Student #" + otherUser.getUserId());
            dto.setOtherUserName(otherUserName);

            dto.setProductId(c.getProduct().getProductId());
            dto.setProductTitle(c.getProduct().getTitle());

            // Get last message
            List<Message> messages = messageRepo.findByConversation(c);
            if (!messages.isEmpty()) {
                Message lastMsg = messages.get(messages.size() - 1);
                dto.setLastMessage(lastMsg.getContent());
                dto.setLastMessageTime(lastMsg.getSentAt());
            }

            return dto;
        }).sorted((c1, c2) -> {
            if (c1.getLastMessageTime() == null)
                return 1;
            if (c2.getLastMessageTime() == null)
                return -1;
            return c2.getLastMessageTime().compareTo(c1.getLastMessageTime());
        }).collect(Collectors.toList());
    }
}
