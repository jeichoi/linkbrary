import Linkbar from "@/components/Linkbar";
import Searchbar from "@/components/Searchbar";
import { ReactNode } from "react";

export default function LinklistLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Linkbar/>
      <Searchbar />
      {children}
    </div>
  );
}
