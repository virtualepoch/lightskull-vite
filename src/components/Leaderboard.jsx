import { usePlayersList } from "playroomkit";

export const Leaderboard = () => {
  const players = usePlayersList(true);

  return (
    <>
      <div className="leaderboard">
        {players.map((player) => (
          <div
            key={player.id}
            className={`player-info`}
            style={{
              color: player.state.profile?.color,
              borderColor: player.state.profile?.color,
              boxShadow: `-2px 4px 4px 1px rgba(0, 0, 0, 0.1),
    inset -1px 1px 4px .1px ${player.state.profile?.color}`,
            }}
          >
            <img
              src={"/images/leaderboard-logo.png"}
              style={{ background: player.state.profile?.color }}
            />

            <h2>{player.state.profile?.name}</h2>

            <p>※{player.state.kills}</p>
            <p>※{player.state.deaths}</p>
            <div className="health-bar">
              <div
                className="health-meter"
                style={{
                  transform: `scaleX(${player.state.health / 100}) translateX(${
                    -1 + player.state.health / 100
                  })`,
                }}
              >
                <p className="health-text">※{player.state.health}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="btn-fullscreen"
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
          className="svg-fullscreen"
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
