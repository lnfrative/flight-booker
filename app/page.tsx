import { getSession } from "@/auth";
import { Box } from "@mui/material";

export default async function Home() {
  const session = await getSession();

  return (
    <Box>
      Hola {session?.email || "invitado"}
    </Box>
  );
}
