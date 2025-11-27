package edu.uth.warranty.service;

import edu.uth.warranty.model.Customer;
import edu.uth.warranty.model.RecallCampaign;
import edu.uth.warranty.model.Vehicle;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {

    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;

    // Inject JavaMailSender
    public EmailNotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Gửi thông báo cho khách hàng khi xe được thêm vào chiến dịch.
     */
    public void sendCampaignNotification(Customer customer, Vehicle vehicle, RecallCampaign campaign) {
        System.out.println("=== BẮT ĐẦU GỬI EMAIL THÔNG BÁO CHIẾN DỊCH ===");
        System.out.println("Khách hàng: " + customer.getName() + " (ID: " + customer.getCustomerId() + ")");
        System.out.println("Email: " + customer.getEmail());
        System.out.println("Xe: " + vehicle.getVIN() + " - " + vehicle.getModel());
        System.out.println("Chiến dịch: " + campaign.getTitle());
        
        if (customer.getEmail() == null || customer.getEmail().trim().isEmpty()) {
            System.err.println("LỖI: Không thể gửi email. Khách hàng " + customer.getName() + " không có địa chỉ email.");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail); // QUAN TRỌNG: Gmail yêu cầu setFrom
            message.setTo(customer.getEmail().trim());
            message.setSubject("[QUAN TRỌNG] THÔNG BÁO TRIỆU HỒI XE EV - " + campaign.getTitle());
            
            String emailBody = String.format(
                "Kính gửi Quý khách hàng %s,\n\n" +
                "Chúng tôi xin thông báo rằng xe điện của Quý khách (VIN: %s, Model: %s) đã được thêm vào một Chiến dịch Triệu hồi/Dịch vụ quan trọng:\n\n" +
                "Tiêu đề: %s\n" +
                "Ngày có hiệu lực: %s đến %s\n\n" +
                "Vui lòng liên hệ trung tâm dịch vụ gần nhất để đặt lịch kiểm tra.\n\n" +
                "Trân trọng,\n" +
                "OEM EV Warranty Management System",
                customer.getName(),
                vehicle.getVIN(),
                vehicle.getModel(),
                campaign.getTitle(),
                campaign.getStartDate(),
                campaign.getEndDate()
            );
            message.setText(emailBody);

            System.out.println("Đang gửi email đến: " + customer.getEmail());
            mailSender.send(message);
            System.out.println("Đã gửi email thông báo chiến dịch thành công đến: " + customer.getEmail());
            System.out.println("=== KẾT THÚC GỬI EMAIL ===");
        } catch (Exception e) {
            System.err.println("LỖI KHI GỬI EMAIL THÔNG BÁO CHIẾN DỊCH:");
            System.err.println("   Email người nhận: " + customer.getEmail());
            System.err.println("   Lỗi: " + e.getMessage());
            System.err.println("   Chi tiết lỗi:");
            e.printStackTrace();
            System.err.println("=== KẾT THÚC LỖI EMAIL ===");
        }
    }
}