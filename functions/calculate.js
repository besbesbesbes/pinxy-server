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
        id: location.id,
        // title: location.locationTitle,
        content: location.content,
        // category: location.category,
        // createdAt: location.createdAt,
        // userId: location.userId,
        // name: location.user.name,
        // displayName: location.user.displayName,
        // email: location.user.email,
        // imageUrl: location.user.imageUrl,
        // bio: location.user.bio,
      })
    )
  );

  const pointsWithinBuffer = turf.pointsWithinPolygon(points, buffer);

  // คำนวณระยะทางระหว่างตำแหน่งผู้ใช้และแต่ละจุดที่อยู่ใน buffer
  const result = pointsWithinBuffer.features.map((feature) => {
    const distance = turf.distance(userPoint, feature, { units: "meters" });
    return {
      postId: feature.properties.id,
      // title: feature.properties.title,
      content: feature.properties.content,
      // category: feature.properties.category,
      // createdAt: feature.properties.createdAt,
      // user: {
      //   userId: feature.properties.userId,
      //   name: feature.properties.name,
      //   displayName: feature.properties.displayName,
      //   email: feature.properties.email,
      //   imageUrl: feature.properties.imageUrl,
      //   bio: feature.properties.bio,
      // },
      // coordinates: feature.geometry.coordinates,
      distance: distance,
    };
  });

  return result;
}

module.exports = getNearbyLandmarks;
