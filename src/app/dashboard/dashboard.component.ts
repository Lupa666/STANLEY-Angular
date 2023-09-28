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

  public courseFormData: courseData = {desc: "", name: ""};
  public coursesCollection: AngularFirestoreCollection<any>;
  public userid: string;
  public listOfCourseIDs!: string[];
  public listOfCourses!: courseData[];
  public courseJoinCode: string = "";
  constructor(
    public afs: AngularFirestore,
    public router: Router
  ) {
    localStorage.removeItem('current-course');
    this.userid = JSON.parse(localStorage.getItem('user')!).uid
    this.coursesCollection = afs.collection("courses")
    //Call for IDs
    afs.collection("user_course", ref =>
        ref.where("uid", "==", this.userid).where("accepted","==",true))
      .valueChanges().subscribe(
        (data) => {
          //console.log(data)
          this.listOfCourseIDs = data.map((obj: any) => obj.cid);
          //Call for courses
          afs.collection<courseData>("courses", ref =>
            ref.where("cid", "in", this.listOfCourseIDs))
            .valueChanges().subscribe(
            (data ) => {
              this.listOfCourses = data;
              //console.log(data)
            }
          )
        }
      )
  }

  OnSubmitCode(){
    if(this.courseJoinCode == ""){
      window.alert("Pole nie może być puste!!!")
    }else if(this.courseJoinCode.length != 20){
      window.alert("Niewłaściwy kod")
    }else{
      this.afs.collection("courses", ref =>
        ref.where("cid", "==", this.courseJoinCode)).valueChanges().subscribe(
        (data) => {
          if(data.length > 0){
            this.afs.collection<userCourseRelation>("user_course", ref =>
              ref.where("cid", "==", this.courseJoinCode)
                .where("uid", "==", this.userid)
            ).valueChanges().subscribe(
              (data) => {
                if(data.length == 0){
                  const newRelation: userCourseRelation ={
                    accepted: false,
                    admin: false,
                    banned: false,
                    cid: this.courseJoinCode,
                    uid: this.userid
                  }
                  this.afs.collection("user_course").add(newRelation)
                }else if(data[0].banned == true){
                  window.alert("Jesteś zbanowany na tym kursie")
                }else if(data[0].accepted == true){
                  window.alert("Już należysz do tego kursu")
                }
              }
            )
          }else{
            window.alert("Niewłaściwy kod (kurs nie istnieje)")
          }
        }
      )
    }
  }

  OnSubmitCourse(){
    if (this.courseFormData.desc == "") {
      window.alert("Opis lub nazwa nie mogą być puste!!!")
    } else if (this.courseFormData.name == "") {
      window.alert("Opis lub nazwa nie mogą być puste!!!")
    } else {
      this.coursesCollection.add(this.courseFormData).then(
        docRef => {
          //console.log(docRef.id);
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
          window.alert(`Utworzono kurs "${this.courseFormData.name}"`)
          this.OnGotoCourse(this.courseFormData)
        }
      )
    }
  }

  OnGotoCourse(currentCourse: courseData){
    localStorage.setItem('current-course', JSON.stringify(currentCourse));
    this.router.navigate(['course-main'])
  }

}
