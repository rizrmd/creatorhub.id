// Instagram user metadata via instatouch (drawrowfly/instagram-scraper).
// Requires an IG session cookie (env INSTAGRAM_SESSION, e.g. "sessionid=...") —
// IG blocks anonymous user lookups.
// Usage: node igmeta.cjs <handle>
// Output: JSON of graphql.user, or {"error": "..."} on failure (exit 1).
const instatouch = require("instatouch");

(async () => {
  const handle = (process.argv[2] || "").replace(/^@/, "");
  if (!handle) {
    console.log(JSON.stringify({ error: "handle empty" }));
    process.exit(1);
  }
  try {
    const meta = await instatouch.getUserMeta(handle, {
      proxy: "",
      session: process.env.INSTAGRAM_SESSION || "",
      timeout: 2000,
    });
    const user = meta && meta.graphql && meta.graphql.user ? meta.graphql.user : null;
    if (!user) {
      console.log(JSON.stringify({ error: "no user data" }));
      process.exit(1);
    }
    console.log(JSON.stringify(user));
  } catch (e) {
    console.log(JSON.stringify({ error: String((e && e.message) || e) }));
    process.exit(1);
  }
})();
