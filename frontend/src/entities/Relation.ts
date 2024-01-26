import User from "./User";

export default interface Relation {
  id: string;
  User1: User;
  User2: User;
  status: string;
}