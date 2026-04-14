import { renderToStaticMarkup } from 'react-dom/server';
import { FaLinkedinIn } from 'react-icons/fa';
import { writeFileSync } from 'node:fs';

const raw = renderToStaticMarkup(FaLinkedinIn({}));
const svg = raw
  .replace('width="1em"', 'width="80"')
  .replace('height="1em"', 'height="80"')
  .replace('fill="currentColor"', 'fill="#ffffff"')
  .replace('stroke="currentColor"', 'stroke="#ffffff"');

writeFileSync('public/assets/social-media/linkedin.svg', svg, 'utf8');
console.log('Created public/assets/social-media/linkedin.svg');
