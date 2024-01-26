import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import Relation from "./entities/Relation";

export type refetchRelation = (
	options?: RefetchOptions | undefined
) => Promise<QueryObserverResult<Relation[], Error>>;

//export const API_URL = "https://g5qv407h-3000.uks1.devtunnels.ms";
export const API_URL = "http://localhost:3000";
// export const API_URL = "http://back.solarsteamgenerator.com";
//export const WS_URL = "wss://g5qv407h-3000.uks1.devtunnels.ms";
export const WS_URL = "ws://localhost:3000";
// export const WS_URL = "ws://back.solarsteamgenerator.com";

export const IMGURL = API_URL + "/uploads/";