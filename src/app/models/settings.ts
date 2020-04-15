export interface SettingsGet {
  data: string;
}

export interface ISettings {
  startWeek?: number;
  workingDays?: Array<number>;
  startHour?: string;
  endHour?: string;
  lang?: string;
}
