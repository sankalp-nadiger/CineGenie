"use client"
import UserProfile from "@/components/ProfileComponent";
import { useParams } from 'next/navigation';

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId ? 
    (Array.isArray(params.userId) ? params.userId[0] : params.userId) : 
    null;
  
  return <UserProfile userId={userId} />;
}