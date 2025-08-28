import { motion } from "framer-motion";

export default function LeaderboardCard({ user, highlight, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => onClick(user)}
      className={`cursor-pointer rounded-2xl shadow-md p-4 border transition transform hover:scale-[1.01] ${
        highlight ? "bg-gradient-to-r from-green-400 to-blue-500 text-white" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-xl font-semibold">#{user.rank}</div>
          <div>
            <p className="font-medium text-base">{user.name}</p>
            <p className={`text-sm ${highlight ? "text-white" : "text-gray-500"}`}>{user.total_points} pts</p>
          </div>
        </div>
        <div className="text-right text-sm">
          <p>Streak: {user.best_streak}</p>
          <p>Courses: {user.active_courses}</p>
        </div>
      </div>
    </motion.div>
  );
}
