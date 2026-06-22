// Generate cinematic gradient placeholder images as data URIs
function cinematicPlaceholder(
  colors: string[],
  label: string
): string {
  const gradient = colors
    .map(
      (c, i) =>
        `<stop offset="${(i / (colors.length - 1)) * 100}%" style="stop-color:${c}"/>`
    )
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">${gradient}</linearGradient></defs>
    <rect width="1600" height="900" fill="url(#g)"/>
    <rect x="160" y="280" width="640" height="340" rx="2" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <text x="800" y="470" text-anchor="middle" fill="rgba(255,255,255,0.12)" font-family="sans-serif" font-size="64" font-weight="300" letter-spacing="16">${label}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const placeholders = {
  noir: [
    cinematicPlaceholder(["#1a1a2e", "#0d0d1a", "#16213e"], "NOIR"),
    cinematicPlaceholder(["#16213e", "#1a1a2e", "#0f3460"], "NOIR"),
    cinematicPlaceholder(["#0d0d1a", "#1a1a2e", "#16213e"], "NOIR"),
    cinematicPlaceholder(["#1a1a2e", "#0f3460", "#0d0d1a"], "NOIR"),
  ],
  velvet: [
    cinematicPlaceholder(["#1a0a0a", "#2d1010", "#1a0a0a"], "VELVET"),
    cinematicPlaceholder(["#2d1010", "#1a0a0a", "#3d1818"], "VELVET"),
    cinematicPlaceholder(["#1a0a0a", "#3d1818", "#2d1010"], "VELVET"),
    cinematicPlaceholder(["#2d1010", "#1a0a0a", "#3d1818"], "VELVET"),
  ],
  kinetic: [
    cinematicPlaceholder(["#0a0a1a", "#101030", "#1a1a4a"], "KINETIC"),
    cinematicPlaceholder(["#101030", "#0a0a1a", "#202050"], "KINETIC"),
    cinematicPlaceholder(["#0a0a1a", "#202050", "#101030"], "KINETIC"),
    cinematicPlaceholder(["#101030", "#0a0a1a", "#202050"], "KINETIC"),
  ],
  sonic: [
    cinematicPlaceholder(["#0a1a0a", "#102010", "#1a301a"], "SONIC"),
    cinematicPlaceholder(["#102010", "#0a1a0a", "#204020"], "SONIC"),
    cinematicPlaceholder(["#0a1a0a", "#204020", "#102010"], "SONIC"),
    cinematicPlaceholder(["#102010", "#0a1a0a", "#204020"], "SONIC"),
  ],
  aether: [
    cinematicPlaceholder(["#1a1a1a", "#0a0a0a", "#2a2a2a"], "AETHER"),
    cinematicPlaceholder(["#0a0a0a", "#2a2a2a", "#1a1a1a"], "AETHER"),
    cinematicPlaceholder(["#1a1a1a", "#0a0a0a", "#2a2a2a"], "AETHER"),
    cinematicPlaceholder(["#2a2a2a", "#1a1a1a", "#0a0a0a"], "AETHER"),
  ],
};
