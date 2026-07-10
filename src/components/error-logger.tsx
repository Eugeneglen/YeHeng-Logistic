"use client";

import { useEffect, useState } from "react";

export function ErrorLogger({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Catch unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      const msg = `[UNHANDLED REJECTION] ${event.reason?.toString?.() ?? event.reason}`;
      console.error(msg);
      console.log(msg);
      try {
        process.stderr.write(msg + "\n");
      } catch {}
    };

    // Catch unhandled errors
    const handleError = (event: ErrorEvent) => {
      const msg = `[UNHANDLED ERROR] ${event.message} @ ${event.filename}:${event.lineno}:${event.colno}`;
      console.error(msg);
      console.log(msg);
      try {
        process.stderr.write(msg + "\n");
      } catch {}
    };

    window.addEventListener("unhandledrejection", handleRejection);
    window.addEventListener("error", handleError);

    // Log that the error logger is active
    console.log("[ErrorLogger] Active — watching for errors");

    return () => {
      window.removeEventListener("unhandledrejection", handleRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  useEffect(() => {
    if (error) {
      const msg = `[ERROR BOUNDARY] ${error.message}\n${error.stack}`;
      console.error(msg);
      console.log(msg);
      try {
        process.stderr.write(msg + "\n");
      } catch {}
    }
  }, [error]);

  if (error) {
    return (
      <div style={{ padding: 40, color: "white", background: "#1a1a1a", fontFamily: "monospace", minHeight: "100vh" }}>
        <h1 style={{ color: "#ef4444", marginBottom: 16 }}>Application Error</h1>
        <pre style={{ whiteSpace: "pre-wrap", fontSize: 13, color: "#d4d4d4" }}>
          {error.message}
          {"\n\n"}
          {error.stack}
        </pre>
      </div>
    );
  }

  return <>{children}</>;
}