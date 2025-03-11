"use client";
import userApiRequest from "@/apiRequests/user";
import { sessionToken } from "@/lib/https";
import React, { useEffect } from "react";

export default function Profile() {
  useEffect(() => {
    const fetchData = async () => {
      const response = await userApiRequest.me();
      console.log("response", response);
    };
    fetchData();
  }, [sessionToken]);
  return <div>Profile</div>;
}
