import { Component } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";


interface questionInput{
  question: string;
  answer: string;
  qid?: string;
  questionid?: string;
}
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {

  public quizName: string = "null";
  public questionList: questionInput[] = [];
  public quizInfo: any;
  public mode: boolean = false;
  public showQuizInputPopup: boolean = false;
  public quizInput: questionInput = {
    answer: "",
    question: ""
  };
  constructor(public afs: AngularFirestore, public router: Router) {
    this.quizInfo = JSON.parse(localStorage.getItem('current-quiz')!)
    this.quizName = this.quizInfo.name;
    this.quizInput.qid = this.quizInfo.qid;
    this.mode = false;
    this.afs.collection<questionInput>("questions",
        ref => ref.where("qid","==",this.quizInfo.qid)
    ).valueChanges().subscribe( (data) => {
      this.questionList = data;
    })
  }

  openQuizInputPopup() {
    this.showQuizInputPopup = true;
  }
  closeQuizInputPopup() {
    this.showQuizInputPopup = false;
  }

  protected readonly open = open;

  onSubmitQuestion() {
    console.log(this.quizInput)
    this.afs.collection<questionInput>("questions").add(this.quizInput).then(
      (docRef) => {
        this.quizInput.questionid = docRef.id
        this.afs.doc(`questions/${docRef.id}`).set(this.quizInput, {merge: true})
        console.log(this.quizInput)
      }
    )
  }

  learningMode() {
    this.mode = false;
  }

  testMode() {
    this.mode = true;
  }

  showAnswer(i: number) {
    const x = document.getElementById("answer" + i)
    if(x != null){
      x.style.display = "block";
    }
  }
}
