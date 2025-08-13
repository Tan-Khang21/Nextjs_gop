"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

import { useRouter } from "next/navigation";
import SpinAnimation from "@/components/items/SpinAnimation";
import {
  getContentHeader,
  getNavbar,
  getWebContent,
} from "./api/reduxContentApi";
import { checkAuth } from "./api/reduxAuthApi";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { loggedIn, loading } = useSelector((state: RootState) => state.auths);
  const router = useRouter();
  useEffect(() => {
    import("bootstrap");
  }, []);
  useEffect(() => {
    dispatch(getNavbar());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getWebContent());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getContentHeader());
  }, [dispatch]);
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  useEffect(() => {
    if (loggedIn == false) {
      router.push("/login");
    }
  }, [dispatch, loggedIn, router]);
  if (loading == true) {
    return (
      <div className="min-vh-100 w-100 d-flex align-items-center justify-content-center">
        <SpinAnimation />
      </div>
    );
  }

  return <>{children}</>;
}
