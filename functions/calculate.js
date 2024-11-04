const turf = require("@turf/turf");

async function getNearbyLandmarks(posts, currentLat, currentLng, dist) {
  // สร้างจุดสำหรับตำแหน่งของผู้ใช้
  const userPoint = turf.point([
    parseFloat(currentLng),
    parseFloat(currentLat),
  ]);

  // สร้าง buffer (รัศมีวงกลม) รอบตำแหน่งผู้ใช้
  const buffer = turf.buffer(userPoint, Number(dist), { units: "meters" });

  // Filter landmarks within buffer distance
  const points = turf.featureCollection(
    posts.map((location) =>
      turf.point([location.locationLng, location.locationLat], {
        title: location.locationTitle,
        content: location.content,
        category: location.category,
        createdAt: location.createdAt,
        userId: location.userId,
        displayName: location.user.displayName,
      })
    )
  );

  const pointsWithinBuffer = turf.pointsWithinPolygon(points, buffer);

  // คำนวณระยะทางระหว่างตำแหน่งผู้ใช้และแต่ละจุดที่อยู่ใน buffer
  const result = pointsWithinBuffer.features.map((feature) => {
    const distance = turf.distance(userPoint, feature, { units: "meters" });
    return {
      title: feature.properties.title,
      content: feature.properties.content,
      category: feature.properties.category,
      createdAt: feature.properties.createdAt,
      userId: feature.properties.userId,
      displayName: feature.properties.displayName,
      coordinates: feature.geometry.coordinates,
      distance: distance,
    };
  });

  return result;
}

module.exports = getNearbyLandmarks;
