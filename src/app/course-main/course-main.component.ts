import { Component } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";

interface quiz{
  name: string;
  aid: string;
  qid?: string;
  cid?: string;
  ownerName: string;
}
interface User {
  uid: string;
  email: string;
  name: string;
  surname: string;
  emailVerified: boolean;
}
interface userCourseRelation{
  uid: string,
  cid: string,
  accepted: boolean,
  admin: boolean,
  banned: boolean
}

interface toAdminInfo{
  uid: string,
  cid: string,
  accepted: boolean,
  admin: boolean,
  banned: boolean,
  email: string,
  name: string,
  surname: string,
  emailVerified: boolean,
}
interface courseData {
  name: string,
  desc: string,
  aid?: string,
  cid?: string
}
interface quizAdminRelation{
  qid: string;
  aid: string;
}

@Component({
  selector: 'app-course-main',
  templateUrl: './course-main.component.html',
  styleUrls: ['./course-main.component.css']
})
export class CourseMainComponent {
  public userid: string;
  public currentCourse: courseData;
  public userCourseRelation: userCourseRelation = {
    accepted: true, admin: false, banned: false, cid: "", uid: ""
  };
  public usersToAdmin!: any[];
  public quizInfo: quiz;
  public quizList: quiz[] = [];

  constructor(public afs: AngularFirestore, public router: Router){
    this.quizInfo ={
      aid: "",
      name: "",
      ownerName: "",
      qid: "",
      cid: ""
    }

    this.userid = JSON.parse(localStorage.getItem('user')!).uid
    this.currentCourse = JSON.parse(localStorage.getItem('current-course')!)

    this.afs.collection<userCourseRelation>("user_course", ref =>
      ref.where("cid", "==", this.currentCourse.cid)
        .where("uid", "==", this.userid)
    ).valueChanges().subscribe( (data) => {
      this.userCourseRelation = data[0];
      if (this.userCourseRelation.admin){
        this.afs.collection<userCourseRelation>("user_course", ref =>
          ref.where("cid", "==", this.currentCourse.cid)
        ).valueChanges().subscribe( (data) => {
          //this.managedUsers = data;
          const tempRelation = data;
          const listOfUserID: string[] = data.map((obj: any) => obj.uid);

          this.afs.collection<User>("users", ref =>
            ref.where("uid", "in", listOfUserID)).valueChanges().subscribe(
            (data) =>{
              const tempUserData = data;

              this.usersToAdmin = tempRelation.map(t1 => ({...t1, ...tempUserData.find(t2 => t2.uid === t1.uid)}))
              console.log(this.usersToAdmin)
            }
          )

        })
      }
    })

    //Call for quizes
    afs.collection<any>("quiz", ref =>
        ref.where("cid", "==", this.currentCourse.cid).orderBy("name"))
        .valueChanges().subscribe(
        (data ) => {
          this.quizList = data;
          console.log(data)
        }
        )
  }

  AcceptUser(uid: string){
    const accepted: any = {
      accepted: true
    };
    this.afs.doc(`user_course/${uid}_${this.currentCourse.cid}`).set(accepted, {
      merge: true
    })
    window.alert("Zaakceptowano")
  }
  BanUser(uid: string){
    const banned: any = {
      banned: true
    };
    this.afs.doc(`user_course/${uid}_${this.currentCourse.cid}`).set(banned, {
      merge: true
    })
    window.alert("Zbanowano")
  }

  UnBanUser(uid:string) {
    const banned: any = {
      banned: false
    };
    this.afs.doc(`user_course/${uid}_${this.currentCourse.cid}`).set(banned, {
      merge: true
    })
    window.alert("Odbanowano")
  }

  OnSubmitQuiz() {
    const userName: string = JSON.parse(localStorage.getItem('user')!).name + " " + JSON.parse(localStorage.getItem('user')!).surname
    this.quizInfo = {
      aid: this.userid,
      ownerName: userName,
      qid: "",
      cid: this.currentCourse.cid,
      name: this.quizInfo.name
    }

    this.afs.collection("quiz").add(this.quizInfo).then((docRef) => {
      this.quizInfo.qid = docRef.id
      this.afs.doc(`quiz/${this.quizInfo.qid}`).set(this.quizInfo, {merge:true})
    })
  }

  goToQuiz(index: number) {
    localStorage.setItem('current-quiz', JSON.stringify(this.quizList[index]));
    window.alert("Navigating to a quiz")
    this.router.navigate(["quiz"])
  }
}
