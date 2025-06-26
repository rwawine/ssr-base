"use client";
import { useRouter } from "next/navigation";

export default function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <button className={className} onClick={() => router.back()}>
      Вернуться назад
    </button>
  );
}
