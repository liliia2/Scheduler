export interface SettingsGet {
  success: boolean;
  data: ISettings;
}

export interface ISettings {
  startWeek?: number;
  workingDays?: Array<number>;
  startHour?: string;
  endHour?: string;
  lang?: string;
}
