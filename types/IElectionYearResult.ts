import { IStateResult } from "./IStateResults";

export interface IElectionYearResult {
  electionYear: number;
  states: IStateResult[];
}
