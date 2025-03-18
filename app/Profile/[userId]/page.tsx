import UserProfile from "@/components/ProfileComponent";
import { useParams } from 'next/navigation';

export default function UserProfilePage() {
  const params = useParams();
  return <UserProfile userId={params.userId} />;
}