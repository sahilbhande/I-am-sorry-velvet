import type { SurpriseConfig } from '../config/personalization';

function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, size * 0.3);
  ctx.bezierCurveTo(
    -size * 0.65,
    -size * 0.25,
    -size * 0.9,
    size * 0.55,
    0,
    size * 1.1
  );
  ctx.bezierCurveTo(
    size * 0.9,
    size * 0.55,
    size * 0.65,
    -size * 0.25,
    0,
    size * 0.3
  );
  ctx.fill();
  ctx.restore();
}

function drawBow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Ribbon tails
  ctx.fillStyle = '#FF8FBD';
  ctx.beginPath();
  ctx.moveTo(-4, 6);
  ctx.lineTo(-22, 34);
  ctx.lineTo(-10, 28);
  ctx.lineTo(-4, 34);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(4, 6);
  ctx.lineTo(22, 34);
  ctx.lineTo(10, 28);
  ctx.lineTo(4, 34);
  ctx.closePath();
  ctx.fill();

  // Left and right loops
  ctx.fillStyle = '#F8B6D2';
  ctx.strokeStyle = '#D94F91';
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.ellipse(-20, 0, 20, 12, -0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(20, 0, 20, 12, 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Center knot
  ctx.fillStyle = '#D94F91';
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + (line ? ' ' : '') + words[i];
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = words[i];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, currentY);
  }
  return currentY;
}

/**
 * Generates and downloads a high-resolution PNG of the Official Barbie Watching Agreement.
 */
export function downloadBarbieCertificatePng(config: SurpriseConfig): void {
  const width = 1600;
  const height = 1120;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background pastel blush gradient
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#FFF6FA');
  bg.addColorStop(0.5, '#FFF0F5');
  bg.addColorStop(1, '#F6EBFC');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Soft decorative radial glow
  const glow = ctx.createRadialGradient(
    width / 2,
    height / 2,
    120,
    width / 2,
    height / 2,
    720
  );
  glow.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
  glow.addColorStop(1, 'rgba(248, 200, 220, 0.18)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Outer card surface
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#F2A8C9';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(56, 56, width - 112, height - 112, 36);
  ctx.fill();
  ctx.stroke();

  // Inner ornamental border
  ctx.strokeStyle = 'rgba(217, 79, 145, 0.35)';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.roundRect(86, 86, width - 172, height - 172, 24);
  ctx.stroke();
  ctx.setLineDash([]);

  // Corner hearts
  const corners = [
    [136, 134],
    [width - 136, 134],
    [136, height - 150],
    [width - 136, height - 150],
  ];
  corners.forEach(([cx, cy]) => drawHeart(ctx, cx, cy, 18, '#FF8FBD'));

  // Top satin bow
  drawBow(ctx, width / 2, 162, 1.35);

  // Kicker
  ctx.textAlign = 'center';
  ctx.fillStyle = '#D94F91';
  ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(config.certificate.treatyLine.toUpperCase(), width / 2, 244);

  // Main Title
  ctx.fillStyle = '#70445C';
  ctx.font = '700 54px "Fraunces", Georgia, serif';
  ctx.fillText(config.certificate.title, width / 2, 320);

  // Divider line
  ctx.strokeStyle = '#F8C8DC';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 220, 352);
  ctx.lineTo(width / 2 + 220, 352);
  ctx.stroke();

  // Subtitle
  ctx.fillStyle = '#8E6279';
  ctx.font = '500 26px "Plus Jakarta Sans", sans-serif';
  wrapText(ctx, config.certificate.subtitle, width / 2, 408, 1080, 38);

  // Awarded to block
  ctx.fillStyle = '#B53574';
  ctx.font = '600 21px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('OFFICIALLY PRESENTED TO', width / 2, 502);

  ctx.fillStyle = '#D94F91';
  ctx.font = '700 66px "Caveat", Georgia, serif';
  ctx.fillText(config.sisterNickname, width / 2, 576);

  // Contract vow summary
  ctx.fillStyle = '#70445C';
  ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
  wrapText(
    ctx,
    config.barbieContract.intro +
      ' ' +
      config.barbieContract.terms.join(' '),
    width / 2,
    644,
    1140,
    36
  );

  // Closing note
  ctx.fillStyle = '#9D4674';
  ctx.font = 'italic 500 24px "Fraunces", Georgia, serif';
  wrapText(ctx, `"${config.certificate.closingNote}"`, width / 2, 774, 1100, 36);

  // Signature & Date footer
  const sigY = 930;
  ctx.textAlign = 'center';

  // Left: Signature
  ctx.fillStyle = '#70445C';
  ctx.font = '600 42px "Caveat", cursive';
  ctx.fillText(config.brotherSignature, 470, sigY - 14);
  ctx.strokeStyle = '#E8A5C4';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(250, sigY);
  ctx.lineTo(690, sigY);
  ctx.stroke();
  ctx.fillStyle = '#8E6279';
  ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('ANNOYING BROTHER SIGNATURE', 470, sigY + 30);

  // Center Wax Seal
  ctx.save();
  ctx.fillStyle = '#D94F91';
  ctx.beginPath();
  ctx.arc(width / 2, sigY - 12, 48, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#F8C8DC';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(width / 2, sigY - 12, 39, 0, Math.PI * 2);
  ctx.stroke();
  drawHeart(ctx, width / 2, sigY - 27, 22, '#FFFFFF');
  ctx.restore();

  // Right: Date
  ctx.fillStyle = '#70445C';
  ctx.font = '600 30px "Fraunces", Georgia, serif';
  ctx.fillText(config.certificateDate, width - 470, sigY - 14);
  ctx.strokeStyle = '#E8A5C4';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width - 690, sigY);
  ctx.lineTo(width - 250, sigY);
  ctx.stroke();
  ctx.fillStyle = '#8E6279';
  ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('DATE SEALED', width - 470, sigY + 30);

  // Trigger download
  const link = document.createElement('a');
  link.download = 'official-barbie-watching-agreement.png';
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
