import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minimal config. Add an R2 incremental cache override later if you enable ISR:
//   import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
//   defineCloudflareConfig({ incrementalCache: r2IncrementalCache })
export default defineCloudflareConfig();
