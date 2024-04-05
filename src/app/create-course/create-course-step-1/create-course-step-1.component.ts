import { Component } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';

const SAMPLE_TEST = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ornare, arcu sed laoreet semper, odio orci congue urna, eget pulvinar tortor lacus vel enim. Sed id magna id augue vulputate accumsan. Pellentesque sagittis, diam quis aliquam pharetra, tortor lorem lacinia mauris, eu sodales nulla ex nec lacus. Ut ac ullamcorper sapien. Pellentesque non est eget ante sollicitudin molestie id vitae sapien. Vestibulum eu ex quis turpis maximus vestibulum vel eget velit. Etiam pretium euismod placerat. Etiam vel dui nisl. Aenean luctus vehicula leo, eu finibus nulla gravida ac. Praesent justo ipsum, ullamcorper ac urna ut, varius vestibulum odio."

@Component({
  selector: "create-course-step-1",
  templateUrl:"create-course-step-1.component.html",
  styleUrls: ["create-course-step-1.component.scss"]
})
export class CreateCourseStep1Component {

  form = this.fb.group({
    title: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(60)
    ]],
    releasedAt: [new Date(1990, 0, 1), Validators.required],
    category: ['BEGINNER', Validators.required],
    courseType: ['premium', Validators.required],
    downloadsAllowed: [false, Validators.requiredTrue],
    longDescription: [SAMPLE_TEST, [Validators.required, Validators.minLength(3)]]
  });

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    const date = cellDate.getDate();
    if (view == 'month') {
      return (date == 1) ? 'highlight-date' : '';
    }

    return '';
  }

  constructor(private fb: UntypedFormBuilder) {

  }

  get courseTitle() {
    return this.form.controls['title'];
  }

}
