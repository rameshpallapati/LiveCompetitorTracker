import { HistoryData } from './historydata.model';
import { CurrentData } from './currentdata.model';
import { ForecastData } from './forecastdata.model';
export class Departure {
    origin: string;
    dest: string;
    date: Date;
    avgPrice: number;
    history: HistoryData[];
    current: CurrentData[];
    forecast: ForecastData[];
  }
