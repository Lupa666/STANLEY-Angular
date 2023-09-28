import { Component } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";

interface courseData {
  name: string,
  desc: string,
  aid?: string,
  cid?: string
}

@Component({
  selector: 'app-course-main',
  templateUrl: './course-main.component.html',
  styleUrls: ['./course-main.component.css']
})
export class CourseMainComponent {
  public userid: string;
  public currentCourse: courseData;
  public quizList!: any[];
  private listOfQuizIDs!: any[];


  constructor(public afs: AngularFirestore, public router: Router){
    this.userid = JSON.parse(localStorage.getItem('user')!).uid
    this.currentCourse = JSON.parse(localStorage.getItem('current-course')!)
    afs.collection("quiz_course", ref =>
      ref.where("cid", "in", this.currentCourse.cid))
      .valueChanges().subscribe(
      (data) => {
        //console.log(data)
        this.listOfQuizIDs = data.map((obj: any) => obj.qid);
        //Call for courses
        afs.collection<any>("quizes", ref =>
          ref.where("qid", "in", this.listOfQuizIDs))
          .valueChanges().subscribe(
          (data ) => {
            this.quizList = data;
            //console.log(data)
          }
        )
      }
    )

  }
}
