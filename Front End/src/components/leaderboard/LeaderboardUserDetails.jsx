import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LeaderboardUserDetails({ user }) {
  return (
    <Card className="border border-blue-100 shadow-sm p-4">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-[#26647e]">
          👤 {user.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-700 space-y-2">
        <p><strong>Rank:</strong> #{user.rank}</p>
        <p><strong>Total Points:</strong> {user.total_points}</p>
        <p><strong>Best Streak:</strong> {user.best_streak} days</p>
        <p><strong>Active Courses:</strong> {user.active_courses}</p>
      </CardContent>
    </Card>
  );
}
