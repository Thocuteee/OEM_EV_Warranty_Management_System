import React from "react";
import "./profile.css";

interface ProfileInfo {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  gender: "Nam" | "Nữ" | "Khác";
  job: string;
  nationality: string;
  avatarUrl: string;
}

const Profile: React.FC = () => {
  const user: ProfileInfo = {
    fullName: "Bạch Tiểu Thuần",
    email: "bachtieuthuan@gmail.com",
    phone: "0901234567",
    birthDate: "1998-10-19",
    address: "Thành phố Hồ Chí Minh",
    gender: "Nam",
    job: "Lập trình viên",
    nationality: "Việt Nam",
    avatarUrl: "avatar.jpg",
  };

  return (
    <div className="profile-container">
      <div className="profile-avatar">
        <img src={user.avatarUrl} alt="Avatar" />
      </div>
      <h2>Thông Tin Cá Nhân</h2>
      <form className="profile-form">
        <label>Họ & Tên</label>
        <input type="text" value={user.fullName} readOnly />

        <label>Email</label>
        <input type="email" value={user.email} readOnly />

        <label>Số điện thoại</label>
        <input type="text" value={user.phone} readOnly />

        <label>Ngày sinh</label>
        <input type="date" value={user.birthDate} readOnly />

        <label>Địa chỉ</label>
        <textarea value={user.address} readOnly />

        <label>Giới tính</label>
        <div className="gender-options">
          <label>
            <input
              type="radio"
              checked={user.gender === "Nam"}
              readOnly
            />{" "}
            Nam
          </label>
          <label>
            <input
              type="radio"
              checked={user.gender === "Nữ"}
              readOnly
            />{" "}
            Nữ
          </label>
          <label>
            <input
              type="radio"
              checked={user.gender === "Khác"}
              readOnly
            />{" "}
            Khác
          </label>
        </div>

        <label>Nghề nghiệp</label>
        <input type="text" value={user.job} readOnly />

        <label>Quốc tịch</label>
        <input type="text" value={user.nationality} readOnly />
      </form>
    </div>
  );
};

export default Profile;
