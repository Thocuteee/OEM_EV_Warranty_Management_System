package edu.uth.warranty.common;

public enum ClaimStatus {
    DRAFT,                  // Bản nháp (chưa gửi)
    SENT,                   // Đã gửi lên Hãng
    WAITING_APPROVAL,       // Chờ Hãng phê duyệt
    APPROVED,               // Đã được Hãng chấp nhận
    REJECTED,               // Đã bị Hãng từ chối
    IN_PROCESS,             // Đang thực hiện bảo hành/sửa chữa
    COMPLETED,              // Đã hoàn thành (bàn giao xe)
    VERIFICATION            // Xác thực (trạng thái chi tiết cho EVM)
}
