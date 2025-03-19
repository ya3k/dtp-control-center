"use client"
import authApiRequest from '@/apiRequests/auth'
import { Button } from '@/components/ui/button'
import { refreshToken, sessionToken, userRole } from '@/lib/http'
import React from 'react'
import Swal from 'sweetalert2'

export default function TrackingToken() {
  const handleClick = async() => {
    const response = await authApiRequest.refreshFromNextClientToNextServer();
    console.log(response);
    sessionToken.value = response?.payload?.data?.accessToken as string;
    refreshToken.value = response?.payload?.data?.refreshToken as string;
    userRole.value = response?.payload?.data?.role as string;
  }
    return (
    <>
        <Button onClick={() => handleClick()}>TrackingToken</Button>
        <Button onClick={() => {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              Toast.fire({
                icon: "success",
                title: "Signed in successfully"
              });
        }}>Test Sweet alert</Button>
    </>
  )
}
