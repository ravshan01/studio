"use client";
// This page is primarily to satisfy the route structure. 
// The actual form rendering and logic is handled by /admin/stations page
// when an 'id' is present.
// A redirect is a clean way to handle this.

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';


export default function EditStationPage() {
  const router = useRouter();
  const params = useParams();
  const stationId = params.id as string;

  useEffect(() => {
    if (stationId) {
      // The actual form will be shown by the parent page logic, passing the ID
      router.replace(`/admin/stations?edit=${stationId}`);
    } else {
      router.replace('/admin/stations'); // Fallback if no ID
    }
  }, [router, stationId]);

  return (
    <div>
      <p>Redirecting to edit station...</p>
    </div>
  );
}
