//atualizado
import { ReactNode } from "react";
import { Box } from "@mui/material";
import ResponsiveAppBar from "./TopBar";
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
      <ResponsiveAppBar />
      {children}
    </Box>
  );
}
