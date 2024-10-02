import { ICandidateResult } from "./ICandidateResult";

export interface IStateResult {
  state: string;
  votes: number;
  electoralVotes: number;
  candidates: ICandidateResult[];
}
