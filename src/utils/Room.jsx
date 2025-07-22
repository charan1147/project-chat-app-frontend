
export function getRoomId(user1, user2) {
  if (!user1 || !user2) {
    throw new Error("Invalid user IDs");
  }
  return [String(user1), String(user2)].sort().join("_");
}

