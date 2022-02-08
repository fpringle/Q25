//const fs = require('fs');

export default function svgPathString ( size, cornerRadius, centerRadius, score, maxScore, xOffset, yOffset ) {
  // rel coords: normal xy, origin at center
  const relToAbs = (x, y) => [size / 2 + x + xOffset, size / 2 - y + yOffset];
  // abs coords: svg format
  const absToRel = (x, y) => [x - size / 2 - xOffset, size / 2 - y - yOffset];

  const pathStart = `<path d="`;
  const pathEnd = `" fill="url(#fg)" stroke="none"/>`;
  const [cx, cy] = relToAbs(0, 0);
  const circle = `<circle cx="${cx}" cy="${cy}" r="${centerRadius}" fill="url(#bg)" stroke="none"/>`;

  if (score === 0) {
    return "";
  }

  const s = size / 2;
  const r = cornerRadius;

  const wayPoints = [
    [0, s],

    [s - r, s],
    [s, s - r],

    [s, r - s],
    [s - r, -s],

    [r - s, -s],
    [-s, r - s],

    [-s, s - r],
    [r - s, s],

    [0, s],
  ];

  const refTheta = 0;
  let theta = ( score / maxScore ) * 2 * Math.PI - refTheta;
  if (theta < 0) theta += 2 * Math.PI;

  const wayPointThetas = wayPoints.map(([x, y]) => {
    let th = Math.atan2(x, y) - refTheta;
    if (th < 0) th += 2 * Math.PI;
    return th;
  });

  //console.log(wayPoints.map(([x,y]) => `(${x}, ${y})`).join('\n'));
  //console.log(wayPointThetas);
  let lineIndex = wayPoints.length - 2;

  for (let i=0; i<wayPoints.length; i++) {
    if (theta < wayPointThetas[i]) {
      lineIndex = i - 1;
      break;
    }
  }
  //console.log(lineIndex);
  // we do lineIndex commands normally, then the next command partially
  const fullCommands = [
    // top center
    ['M', ...relToAbs(...wayPoints[0])],
    // horz to top right corner
    ['H', relToAbs(...wayPoints[1])[0]],
    // curve round top right corner
    ['A', r, r, 0, 0, 1, ...relToAbs(...wayPoints[2])],
    // vert to bottom right corner
    ['V', relToAbs(...wayPoints[3])[1]],
    // curve round bottom right corner
    ['A', r, r, 0, 0, 1, ...relToAbs(...wayPoints[4])],
    // horz to bottom left corner
    ['H', relToAbs(...wayPoints[5])[0]],
    // curve round bottom left corner
    ['A', r, r, 0, 0, 1, ...relToAbs(...wayPoints[6])],
    // vert to top left corner
    ['V', relToAbs(...wayPoints[7])[1]],
    // curve round top left corner
    ['A', r, r, 0, 0, 1, ...relToAbs(...wayPoints[8])],
    // horz to top center
    ['H', relToAbs(...wayPoints[9])[0]],
  ];
  if (+score === +maxScore) {
    console.log('full');
    return pathStart + fullCommands.map(x => x.join(' ')).join(' ') + pathEnd + circle;
  } else if (maxScore === 230 ) console.log('not equal: ', score, maxScore);
  //console.log(fullCommands);
  //console.log(fullCommands.map(x => x.join(' ')).join(' '));

  let commands = fullCommands.slice(0, lineIndex+1);
  //console.log(commands);
  //console.log(commands.map(x => x.join(' ')).join(' '));

  //console.log(theta, refTheta);
  const absTheta = Math.PI / 2 - theta - refTheta;
  //console.log(absTheta);
  const t = Math.tan(absTheta);
  let x,y;
  const c = s - r + r / Math.sqrt(2);
  switch (lineIndex) {
    case 2: [x, y] = [s, s * t]; break;
    case 4: [x, y] = [-s / t, -s]; break;
    case 6: [x, y] = [-s, -s * t]; break;
    case 0:
    case 8: [x, y] = [s / t, s]; break;
    case 3: [x, y] = [c, -c]; break;
    case 5: [x, y] = [-c, -c]; break;
    case 7: [x, y] = [-c, c]; break;
    case 1: [x, y] = [c, c]; break;
  }
  let [X, Y] = relToAbs(x, y);
  X = Math.round(X * 1000) / 1000;
  Y = Math.round(Y * 1000) / 1000;
  const finalCommand = fullCommands[lineIndex+1].slice();
  if (finalCommand[0] == 'A') {
    finalCommand.splice(finalCommand.length - 2, 2, X, Y);
  } else if (finalCommand[0] == 'H') {
    finalCommand.splice(finalCommand.length - 1, 1, X);
  } else if (finalCommand[0] == 'V') {
    finalCommand.splice(finalCommand.length - 1, 1, Y);
  }

  commands.push(finalCommand);

  // to center circle
  let _x = centerRadius / Math.sqrt(1 + t**2);
  let _y = t * _x;
  //console.log(x, y);
  //console.log(_x, _y);
  if (x * _x < 0) _x *= -1;
  if (y * _y < 0) _y *= -1;
//  console.log(_x, _y);
  const R = centerRadius;
  commands.push(['L', ...relToAbs(_x, _y)]);
  //console.log(theta+refTheta);
  const bigArc = theta+refTheta >= Math.PI ? 1 : 0;
  commands.push(['A', R, R, 0, bigArc, 0, ...relToAbs(0, R)]);
  commands.push(['Z']);
  return pathStart + commands.map(x => x.join(' ')).join(' ') + pathEnd;
}

//const commands = svgPathString( 200, 10, 45, '', '', 6, 16 );
//console.log(commands.map(x => x.join(' ')).join(' '));
const s1 = `<svg version="1.1" width="220" height="220" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!--
    <linearGradient id="bg">
      <stop stop-color="#757575"/>
    </linearGradient>
    <linearGradient id="fg">
      <stop stop-color="#FAFAFA"/>
    </linearGradient>
    -->
    <linearGradient id="bg">
      <stop stop-color="#FAFAFA"/>
    </linearGradient>
    <linearGradient id="fg">
      <stop stop-color="#757575"/>
    </linearGradient>
    <!--
    <linearGradient id="bg">
      <stop stop-color="#0D0208"/>
    </linearGradient>
    <linearGradient id="fg">
      <stop stop-color="#008F11"/>
    </linearGradient>
    -->
  </defs>

  <rect x="0" y="0" width="100%" height="100%" fill="url(#bg)"/>
  <rect x="10" y="10" width="200" height="200" fill="url(#bg)" rx="10" ry="10" stroke="url(#fg)"/>
  `;
const s2 = `
  <!--<text x="50%" y="50%" text-anchor="middle" font-size="52" fill="url(#fg)">10</text>-->
</svg>
`
/*
for (let i=0; i<=16; i++) {
  let commands = svgPathString( 200, 10, 45, 'url(#bg)', 'url(#fg)', i, 16, 10, 10 );
  let svg = s1 + commands + s2;
  fs.writeFileSync(`svgs/${i}.svg`, svg);
}
*/

