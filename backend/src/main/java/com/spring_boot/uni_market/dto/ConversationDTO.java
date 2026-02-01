package com.spring_boot.uni_market.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ConversationDTO {
    private Long conversationId;
    private Long otherUserId;
    private String otherUserName;
    private Long productId;
    private String productTitle;
    private String productImage;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
}
