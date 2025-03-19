"use client";
import userApiRequest from "@/apiRequests/user";
import React, { useEffect } from "react";

export default function Profile() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await userApiRequest.me();
        console.log("response", response);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, []);
  return <div>Profile</div>;
}
