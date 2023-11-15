import { usePlayersList } from "playroomkit";

export const Leaderboard = () => {
  const players = usePlayersList(true);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 px-2 flex gap-1 z-10">
        {players.map((player) => (
          <div
            key={player.id}
            className={`leader-cell flex items-center gap-1 min-w-[140px]`}
            style={{
              color: player.state.profile?.color,
              borderColor: player.state.profile?.color,
              boxShadow: `-2px 4px 4px 1px rgba(0, 0, 0, 0.1),
    inset -1px 1px 4px .1px ${player.state.profile?.color}`,
            }}
          >
            <img
              src={
                // player.state.profile?.photo ||
                "/images/leaderboard-logo.png"
              }
              className="leader-cell-img w-5 h-5 rounded-full m-1"
              style={{
                background: player.state.profile?.color,
                filter: "drop-shadow(0 0 5px cyan)",
              }}
            />

            <h2 className={`font-bold text-sm`}>
              {player.state.profile?.name}
            </h2>

            <div className="flex text-sm items-center gap-2">
              <p>🔫 {player.state.kills}</p>
              <p>💀 {player.state.deaths}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        className="fixed top-0 right-0 z-10 text-white p-3"
        onClick={() => {
          // toggle fullscreen
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.documentElement.requestFullscreen();
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
          />
        </svg>
      </button>
    </>
  );
};
