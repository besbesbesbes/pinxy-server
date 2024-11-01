const turf = require("@turf/turf");

async function checkTwoPoint(curLat, curLng, targetLat, targetLng) {
  const curPoint = turf.point([parseFloat(curLng), parseFloat(curLat)]);
  const targetPoint = turf.point([
    parseFloat(targetLng),
    parseFloat(targetLat),
  ]);

  if (!curPoint || !targetPoint) {
    return false;
  }

  const distance = turf.distance(curPoint, targetPoint, { units: "meters" });

  if (distance <= 1000) {
    return true;
  } else {
    return false;
  }
}

module.exports = checkTwoPoint;
