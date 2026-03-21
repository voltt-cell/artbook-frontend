
import type { NextConfig } from "next";

// Patch for Node.js v25+ broken localStorage
if (typeof globalThis.localStorage !== 'undefined') {
  try {
    // Check if it's the broken native implementation
    globalThis.localStorage.getItem('test');
  } catch (e) {
    // If it throws, replace it with a dummy implementation
    console.log('Patching broken Node.js localStorage...');
    const storage = new Map<string, string>();
    (globalThis as any).localStorage = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, String(value)),
      removeItem: (key: string) => storage.delete(key),
      clear: () => storage.clear(),
      get length() { return storage.size; },
      key: (index: number) => [...storage.keys()][index] ?? null,
    };
  }
}

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
