import manifest from "@/assets/manifest.json";

type AssetKind = keyof typeof manifest;

export function assetUrl(kind: AssetKind, key: string) {
  const file = (manifest as any)[kind]?.[key] as string | undefined;
  return file ? `/${kind}/${file}` : null;
}
