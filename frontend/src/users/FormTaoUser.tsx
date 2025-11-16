'use client';
import React, { useState } from 'react';
// FIX 1: Loại bỏ UserRole và chỉ sử dụng CreateUserPayload và UserRoleBackend
import { CreateUserPayload, UserRoleBackend } from '@/types/admin'; 
import { createNewUser } from '@/services/warrantyApi';

interface FormTaoUserProps {
  onSuccess: (message: string) => void;
  onClose: () => void;
}

// FIX 2: Khai báo roleOptions sử dụng kiểu UserRoleBackend chính xác
const roleOptions: { label: string; value: UserRoleBackend }[] = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'EVM Staff', value: 'EVM_STAFF' },
  { label: 'SC Staff', value: 'SC_STAFF' },
  { label: 'SC Technician', value: 'SC_TECHNICIAN' },
];

const FormTaoUser: React.FC<FormTaoUserProps> = ({ onSuccess, onClose }) => {
  // Khởi tạo state sử dụng CreateUserPayload
  const [formState, setFormState] = useState<CreateUserPayload>({
    username: '',
    password: '',
    role: 'SC_STAFF', // Mặc định SC Staff
  }); 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, 
  ) => {
    const { name, value } = event.target;
    
    setFormState((prev) => {
        if (name === 'role') {
            // FIX 3: Ép kiểu 'role' an toàn và dứt khoát
            return { ...prev, role: value as UserRoleBackend }; 
        }
        
        return { ...prev, [name as keyof CreateUserPayload]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Gửi formState (kiểu CreateUserPayload)
      await createNewUser(formState); 
      
      onSuccess("Tài khoản đã được tạo thành công!");
      onClose(); 
    } catch (err: unknown) {
      
      let errorMessage: string = "Lỗi tạo người dùng không xác định.";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        errorMessage = (err as { message: string }).message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... (Phần JSX tương tự)
    <form onSubmit={handleSubmit} className="space-y-4">
    {/* ... (Các Input) */}
    </form>
  );
};

export default FormTaoUser;