import ResetPasswordForm from "./reset-password-form";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu mới",
  description: "Đặt mật khẩu mới cho tài khoản của bạn.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
