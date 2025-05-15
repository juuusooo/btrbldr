import ResizableLayout from "@/components/ResizableLayout";

export default function Home() {
  window.api.greet("Hello from console");

  return <div style={{ backgroundColor: "#090909", height: "100vh", width: "100vw" }}>
    <ResizableLayout />
  </div>
}
