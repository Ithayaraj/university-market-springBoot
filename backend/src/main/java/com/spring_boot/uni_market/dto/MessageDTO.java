package com.spring_boot.uni_market.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MessageDTO {
    private Long messageId;
    private Long senderId;
    private Long receiverId;
    private Long productId;
    private String content;
    private LocalDateTime sentAt;
    private boolean isRead;
}
