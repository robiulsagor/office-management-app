import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generate Documents - Office Management App",
};

const Generate = () => {
  return (
    <Link href="/generate-documents/challan">
      <Button>Generate Challan</Button>
    </Link>
  );
};

export default Generate;
