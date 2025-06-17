export const getPasswordError = (val?: string): string | undefined => {
  if (!val) return;
  if (val.length < 6) return "Mật khẩu phải ít nhất 6 ký tự";
  if (!/[A-Z]/.test(val)) return "Mật khẩu phải có chữ in hoa";
  if (!/[0-9]/.test(val)) return "Mật khẩu phải có số";
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(val))
    return "Mật khẩu phải có ký tự đặc biệt";
  return;
};
