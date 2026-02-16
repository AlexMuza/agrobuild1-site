import "dotenv/config";
import { createApp } from "./app.js";

const { app } = createApp();
// Most hosting providers inject PORT; keep SERVER_PORT for local/dev.
const port = Number(process.env.PORT || process.env.SERVER_PORT || 8787);

app.listen(port, () => {
  console.log(`Lead backend running on http://localhost:${port}`);
});

