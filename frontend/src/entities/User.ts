import Achivements from "./Achievement";
import Match from "./GameHistory";

export default interface User {
  id: string;
  oauth_id: string | null;
  username: string;
  email: string;
  avatar: string;
  is_online: Boolean;
  is_in_game: Boolean;
  is_profile_finished: Boolean;
  achivement: Achivements[];
  matchHistory: Match[];
  two_factor_auth_enabled: boolean;
}
