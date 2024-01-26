// gameInviteStore.ts 


import { create } from 'zustand';
import { Invite } from '../types/prisma';

type GameInviteStore = {
	gameInvites: Invite[];
	addGameInvite: (gameInvite: Invite) => void;
	removeGameInvite: (gameInvite: Invite) => void;
	setGameInvite: (gameInvite: Invite) => void;
};

export const useGameInviteStore = create<GameInviteStore>((set) => ({
	gameInvites: [],
	addGameInvite: (gameInvite) =>
		set((state) => ({
			gameInvites: [...state.gameInvites, gameInvite],
		})),
	removeGameInvite: (gameInvite) =>
		set((state) => ({
			gameInvites: state.gameInvites.filter(
				(n) => n.id !== gameInvite.id
			),
		})),
	setGameInvite: (gameInvite: Invite) => {
		set((state) => {
			state.gameInvites[state.gameInvites.findIndex((n => n.id === gameInvite.id))] = gameInvite
			return {
				gameInvites: state.gameInvites,
			}
		})
	}
}));