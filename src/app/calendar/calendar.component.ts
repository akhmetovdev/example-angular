import { Component, OnInit } from '@angular/core';
import { DateTime, Duration, Info, Interval } from 'luxon';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  currentDateTime: DateTime;
  weekdays: string[];
  rows: string[][];

  constructor() {
    this.currentDateTime = DateTime.local();
    this.weekdays = Info.weekdays('short');
    this.rows = this.getRows();
  }

  ngOnInit() {}

  handleClickNextMonth() {
    const index = this.currentDateTime.month;
    const condition = index === 12;
    const month = condition ? 1 : index + 1;
    const year = condition ? this.currentDateTime.year + 1 : this.currentDateTime.year;

    this.currentDateTime = this.currentDateTime.set({ month, year });
    this.rows = this.getRows();
  }

  handleClickPreviousMonth() {
    const index = this.currentDateTime.month;
    const condition = index === 1;
    const month = condition ? 12 : index - 1;
    const year = condition ? this.currentDateTime.year - 1 : this.currentDateTime.year;

    this.currentDateTime = this.currentDateTime.set({ month, year });
    this.rows = this.getRows();
  }

  getRows(): string[][] {
    const startOfMonth = this.currentDateTime.startOf('month');
    const endOfMonth = this.currentDateTime.endOf('month');
    const startOfFirstWeek = startOfMonth.startOf('week');
    const endOfLastWeek = endOfMonth.endOf('week');
    const weekDuration = Duration.fromObject({ weeks: 1 });
    const monthInterval = Interval.fromDateTimes(
      startOfFirstWeek,
      endOfLastWeek
    );
    const weekIntervals = monthInterval.splitBy(weekDuration);

    return weekIntervals.map(interval => {
      const { start } = interval;

      return Array.from({ length: 7 }, (item, index) => {
        const date = start.plus({ days: index });

        return date.month === this.currentDateTime.month
          ? date.day.toString()
          : '';
      });
    });
  }
}
