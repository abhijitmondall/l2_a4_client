"use client";

import { useToast } from "@/hooks/useToast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-4 sm:right-4 sm:w-[420px]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto relative flex w-full items-start gap-4 overflow-hidden rounded-lg border p-4 pr-6 shadow-lg transition-all ${
            toast.variant === "destructive"
              ? "border-red-200 bg-red-50"
              : "border-gray-200"
          } ${
            toast.variant === "success"
              ? "border-green-300 bg-green-50"
              : "border-gray-200 bg-white"
          } animate-fade-in`}
        >
          <div className="flex-1">
            <p
              className={`text-sm font-semibold ${
                toast.variant === "destructive"
                  ? "text-red-900"
                  : "text-gray-900"
              } ${
                toast.variant === "success" ? "text-green-800" : "text-gray-900"
              }`}
            >
              {toast.title}
            </p>
            {toast.description && (
              <p
                className={`mt-1 text-sm ${
                  toast.variant === "destructive"
                    ? "text-red-700"
                    : "text-gray-600"
                }  ${
                  toast.variant === "success"
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                {toast.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
