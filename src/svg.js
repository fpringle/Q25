

export default function svgPathString ( size, cornerRadius, centerRadius, score, maxScore ) {
  // rel coords: normal xy, origin at center
  const relToAbs = (x, y) => [size / 2 + x, size / 2 - y];
  // abs coords: svg format
  const absToRel = (x, y) => [x - size / 2, size / 2 - y];

  const [cx, cy] = relToAbs(0, 0);

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

  let lineIndex = wayPoints.length - 2;

  for (let i=0; i<wayPoints.length; i++) {
    if (theta < wayPointThetas[i]) {
      lineIndex = i - 1;
      break;
    }
  }
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
    return fullCommands.map(x => x.join(' ')).join(' ');
  }

  let commands = fullCommands.slice(0, lineIndex+1);
  const absTheta = Math.PI / 2 - theta - refTheta;
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
  if (x * _x < 0) _x *= -1;
  if (y * _y < 0) _y *= -1;
  const R = centerRadius;
  commands.push(['L', ...relToAbs(_x, _y)]);
  const bigArc = theta+refTheta >= Math.PI ? 1 : 0;
  commands.push(['A', R, R, 0, bigArc, 0, ...relToAbs(0, R)]);
  commands.push(['Z']);
  return commands.map(x => x.join(' ')).join(' ');
}
