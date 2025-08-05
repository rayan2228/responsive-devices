import ResponsiveContainer from "@/components/ResponsiveContainer";
import { Suspense } from "react";
import Loading from "./loading";
export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <ResponsiveContainer />
    </Suspense>
  );
}
