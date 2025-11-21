package edu.uth.warranty.model;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Objects;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "CampaignVehicle")
@IdClass(CampaignVehicle.CampaignVehicleId.class)
public class CampaignVehicle {
    public static class CampaignVehicleId implements Serializable {
        private Long campaign; 
        private Long vehicle;

        public CampaignVehicleId() {}

        public CampaignVehicleId(Long campaign, Long vehicle) {
            this.campaign = campaign;
            this.vehicle = vehicle;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            CampaignVehicleId id = (CampaignVehicleId) o;
            return Objects.equals(campaign, id.campaign) && Objects.equals(vehicle, id.vehicle);
        }

        @Override
        public int hashCode() {
            return Objects.hash(campaign, vehicle);
        }
    }

    // KHẮC PHỤC LỖI TẠO CỘT DƯ THỪA và ANNOTATIONEXCEPTION 
    // Các trường này cần phải có vì được tham chiếu bởi @IdClass và @MapsId, 
    // NHƯNG cần ngăn Hibernate cố gắng ánh xạ chúng thành cột độc lập (đã bị xóa).

    @Id
    @Column(name = "campaign_id", insertable = false, updatable = false) // <-- THÊM LẠI CÁC TRƯỜNG NÀY VÀ FIX LỖI JPA
    private Long campaign; 

    @Id
    @Column(name = "vehicle_id", insertable = false, updatable = false) // <-- THÊM LẠI CÁC TRƯỜNG NÀY VÀ FIX LỖI JPA
    private Long vehicle; 
    
    // Bây giờ, các trường ManyToOne mới thực hiện việc ánh xạ quan hệ
    // Giữ nguyên @MapsId để liên kết với các trường ID phức hợp ở trên
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("campaign") 
    @JoinColumn(name = "campaign_id", nullable = false)
    private RecallCampaign recallCampaignEntity; 
    
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("vehicle") 
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicleEntity;

    @Column(name = "status", nullable = false)
    private String status;

    public CampaignVehicle(Vehicle vehicle, String status, RecallCampaign campaign) {
        this.vehicleEntity = vehicle;
        this.status = status;
        this.recallCampaignEntity = campaign;
    } 
    // LƯU Ý: Bạn cần chỉnh sửa constructor này (nếu đang dùng) 
    // hoặc XÓA nó và sử dụng constructor do Lombok tạo nếu nó gây lỗi.
    // Nếu bạn muốn giữ constructor tùy chỉnh, nó cần phải phù hợp với @AllArgsConstructor của Lombok
    // (Lombok sẽ tạo constructor với tất cả các trường không phải static/final)
}