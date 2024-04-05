import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from "@angular/router";
import { merge, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Course } from "../model/course";
import { Lesson } from '../model/lesson';
import { CoursesService } from "../services/courses.service";


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, AfterViewInit {

  course:Course;

  lessons: Lesson[] = [];
  expandedLesson: Lesson;

  loading = false;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild(MatSort)
  sort: MatSort;

  selection = new SelectionModel<Lesson>(true, []);

  constructor(private route: ActivatedRoute,
              private coursesService: CoursesService) {

  }

  displayedColumns = ['select', 'seqNo', 'description', 'duration']

  ngOnInit() {

      this.course = this.route.snapshot.data["course"];

      this.loadLessonsPage();


  }

  onLessonToggled(lesson: Lesson) {
    this.selection.toggle(lesson);

    console.log(this.selection.selected)
  }

  loadLessonsPage() {

    this.loading = true;

    this.coursesService.findLessons(
      this.course.id,
      this.sort?.direction ?? 'asc',
      this.paginator?.pageIndex ?? 0,
      this.paginator?.pageSize ?? 3,
      this.sort?.active ?? "seqNo")
    .pipe(
      tap(lessons => this.lessons = lessons),
      catchError(err => {
        alert("error loading lessons.");
        return throwError(err);
      }),
      finalize(() => this.loading = false)
    )
    .subscribe();

  }

  onToggleLesson(lesson: Lesson) {
    if (lesson == this.expandedLesson) {
      this.expandedLesson = null;
    } else {
      this.expandedLesson = lesson;
    }
  }

  ngAfterViewInit() {

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
      tap(() => this.loadLessonsPage())
    )
    .subscribe();

    this.sort.sortChange

  }

  isAllSelected() {
    return this.selection.selected?.length == this.lessons?.length && this.selection.hasValue();
  }

  isSomeSelected() {
    return !this.isAllSelected() && this.selection.selected?.length > 0;
  }

  toggleAll() {
    this.isAllSelected() ? this.selection.clear() : this.selection.select(...this.lessons);
  }

}
