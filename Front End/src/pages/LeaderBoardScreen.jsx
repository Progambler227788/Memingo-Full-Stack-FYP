import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../services/leaderBoardService";
import LeaderboardList from "../components/leaderboard/LeaderboardList";
import LeaderboardUserDetails from "../components/leaderboard/LeaderboardUserDetails";
import { Loader2, ChevronDown } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { Card } from "@/components/ui/card";

export default function LeaderboardScreen() {
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all_time");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        setLoading(true);
        const data = await fetchLeaderboard(period);
        setLeaderboard(data);
        setSelectedUser(null); // Reset selection when period changes
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, [period]);

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-sky-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#26647e]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-sky-50 flex items-center justify-center p-4">
      <Card className="min-h-screen w-screen max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left: Leaderboard + Period Selector */}
        <div className="col-span-2 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-800">
              🏆 Leaderboard
            </h1>

            {/* Period Selector */}
            <Select.Root value={period} onValueChange={setPeriod}>
              <Select.Trigger className="inline-flex items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black">
                <Select.Value />
                <ChevronDown className="ml-2 h-4 w-4" />
              </Select.Trigger>

              <Select.Content className="rounded-lg border bg-white shadow-lg overflow-hidden z-50">
                <Select.Viewport className="p-1">
                  {["all_time", "weekly", "monthly"].map((value) => (
                    <Select.Item
                      key={value}
                      value={value}
                      className="px-4 py-2 text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-md"
                    >
                      <Select.ItemText>
                        {value.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase())}
                      </Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Root>
          </div>

          {/* Leaderboard List */}
          <LeaderboardList
            users={leaderboard.leaderboard}
            currentUserId={leaderboard.current_user_rank?.user_id}
            onUserClick={(user) => setSelectedUser(user)}
          />
        </div>

        {/* Right: Selected User Details */}
        <div className="col-span-1">
          {selectedUser && <LeaderboardUserDetails user={selectedUser} />}
        </div>
      </Card>
    </div>
  );
}
