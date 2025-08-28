import LeaderboardCard from "./LeaderboardCard";

export default function LeaderboardList({ users, currentUserId, onUserClick }) {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <LeaderboardCard
          key={user.user_id}
          user={user}
          highlight={user.user_id === currentUserId}
          onClick={onUserClick}
        />
      ))}
    </div>
  );
}
