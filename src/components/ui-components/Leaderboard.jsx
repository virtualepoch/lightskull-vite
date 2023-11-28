import { usePlayersList } from "playroomkit";
import { useState } from "react";

export const Leaderboard = () => {
  const players = usePlayersList(true);
  const [fullscreen, setFullscreen] = useState(false);

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
            <h2 className="name">{player.state.profile?.name}</h2>
            <p className="kills">+{player.state.kills}</p>
            <div className="health-bar">
              <div
                className="health-meter"
                style={{
                  width: `${player.state.health}%`,
                  boxShadow:
                    player.state.health < 51
                      ? "inset 0 0 10px 1px #ff0000"
                      : "inset 0 0 10px 1px cyan",
                }}
              ></div>
              <p className="health-text">‹{player.state.health}›</p>
            </div>
            <p className="deaths">-{player.state.deaths}</p>
          </div>
        ))}
      </div>
      <button
        className={fullscreen ? "btn-fullscreen clicked" : "btn-fullscreen"}
        onClick={() => {
          // toggle fullscreen
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.documentElement.requestFullscreen();
          }
          setFullscreen(!fullscreen);
        }}
      />
    </>
  );
};
