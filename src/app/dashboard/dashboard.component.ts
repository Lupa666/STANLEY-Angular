import { Component } from '@angular/core';
import {
  AngularFirestore, AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {mapToObject} from "@angular/fire/compat/remote-config";

interface courseData {
  name: string,
  desc: string,
  aid?: string,
  cid?: string
}
interface userCourseRelation{
  uid: string,
  cid: string,
  accepted: boolean,
  admin: boolean,
  banned: boolean
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  courseFormData: courseData = {desc: "", name: ""};
  public coursesCollection: AngularFirestoreCollection<any>;
  public userid: string;
  public listOfCourseIDs!: string[];
  public listOfCourses!: courseData[];
  constructor(
    public afs: AngularFirestore,
    public router: Router
  ) {
    localStorage.removeItem('current-course');
    this.userid = JSON.parse(localStorage.getItem('user')!).uid
    this.coursesCollection = afs.collection("courses")
    //Call for IDs
    afs.collection("user_course", ref =>
        ref.where("uid", "==", this.userid).where("accepted","==","true"))
      .valueChanges().subscribe(
        (data) => {
          this.listOfCourseIDs = data.map((obj: any) => obj.cid);
          //test
          //Call for courses
          afs.collection<courseData>("courses", ref =>
            ref.where("cid", "in", this.listOfCourseIDs))
            .valueChanges().subscribe(
            (data ) => {
              this.listOfCourses = data;
            }
          )
        }
      )
  }

  OnSubmitCourse(){
    if (this.courseFormData.desc == "") {
      window.alert("Opis lub nazwa nie mogą być puste!!!")
    } else if (this.courseFormData.name == "") {
      window.alert("Opis lub nazwa nie mogą być puste!!!")
    } else {
      console.log(this.courseFormData)
      this.coursesCollection.add(this.courseFormData).then(
        docRef => {
          console.log(docRef.id);
          this.courseFormData.cid = docRef.id;
          this.courseFormData.aid = this.userid;
          this.afs.doc(`courses/${this.courseFormData.cid}`).set(
            this.courseFormData, {
              merge: true
            }
          )
          const newRelation: userCourseRelation = {
            uid: JSON.parse(localStorage.getItem('user')!).uid,
            cid: docRef.id,
            accepted: true,
            admin: true,
            banned: false
          }
          this.afs.doc(`user_course/${newRelation.uid+"_"+newRelation.cid}`).set(
            newRelation, {
              merge: true
            }
          )
          localStorage.setItem('current-course', JSON.stringify(this.courseFormData));
          window.alert(`Utworzono kurs "${this.courseFormData.name}"`)
          this.router.navigate(['course-main'])
        }
      )
    }
  }

  OnGotoCourse(currentCourse: courseData){
    localStorage.setItem('current-course', JSON.stringify(currentCourse));
    this.router.navigate(['course-main'])
  }

}
