import { Component, OnInit } from '@angular/core';
import { LoggService } from '../../services/logg.service';
import { AbstractControl, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-logging',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.css']
})
export class LoggingComponent implements OnInit {

  loggs: any[] = [];
  allLoggs: any[] = [];
  selectedTimeframe: FormControl = new FormControl('Last 5 mins');
  customStartTime: FormControl = new FormControl();
  customEndTime: FormControl = new FormControl();
  showId = true;
  showIP = true;
  showUsername = true;
  showRequestBody = true;
  showTimestamp = true;
  timestemp :any;

  constructor(private loggService: LoggService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.timestemp = 5;
    this.getLogDetails();
    this.selectedTimeframe.valueChanges.subscribe((selectedValue) => {
      this.onTimeframeSelection(selectedValue);
      if(selectedValue != "Custom") {
        this.getLogDetails();
      }
    });
  }

  onTimeframeSelection(selectedValue: string) {
    if (selectedValue === 'Custom') {
      this.customStartTime.reset();
      this.customEndTime.reset();
      this.timestemp = "Custom"
    } else {
      let minutes = 5;
      if (selectedValue === 'Last 10 mins') {
        minutes = 10;
      } else if (selectedValue === 'Last 30 mins') {
        minutes = 30;
      }
      this.timestemp = minutes
    }
  }

  getLogDetails() {
    const endTime = this.customEndTime.value;
    let startTime: any = null;
    if (this.timestemp === 'Custom') {
      startTime = this.customStartTime.value;
      this.loggs = [];
    } else {
      const currentTime = new Date();
      const time = new Date(currentTime.getTime() - this.timestemp * 60000);
      startTime = this.datePipe.transform(time, 'HH:mm');
    }
    this.loggService.getLogs(startTime, endTime).subscribe((res) => {
      this.loggs = res.items;
    });
  }
}
