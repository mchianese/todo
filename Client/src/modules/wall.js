import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { AuthService } from 'aurelia-auth';
import { Todos } from '../resources/data/todo';
import { Users } from '../resources/data/users';
import moment from 'moment';



import {
  ValidationControllerFactory,
  ValidationController,
  ValidationRules
} from 'aurelia-validation';

@inject(Router, AuthService, Todos, Users)
export class Wall {

  constructor(router, auth, todos, users) {
    this.router = router;
    this.auth = auth;
    this.todos = todos;
    this.message = 'Todo';
    this.wallMessage = "";
    this.saveStatus = "";
    this.newTodo;
    this.users = users;
    this.notMe = false;

    this.userscreenname = '';
    this.showList = true;
    this.SaveTodoError = '';
    this.datenow = moment(new Date()).format("YYYY-MM-DD");
    this.InputPriority = "Low";
        this.showCompleted = false;
        this.todoedit = false;
        this.editid = '';
     



  }

  async editTodo(index) {
    this.todoedit = true;
    this.editid = this.todos.todoArray[index]._id;
    this.newTodo = this.todos.todoArray[index].todo;
    this.inputPriority = this.todos.todoArray[index].priority;
    this.datenow = this.todos.todoArray[index].dateDue;
    this.showList = false;

  }


  logout() {
    sessionStorage.removeItem('user');
    this.auth.logout();
  }
 // home() {
  //  this.router.navigate('wall');
 //   this.activate();
  //  this.notMe = false;
  //  this.searchScreenName = '';

async home(){
    this.notMe = false;
    await this.todos.getUsersTodos(this.user._id);
    this.users.setUser(this.user);



  }

 async AddTodo(){

   this.showList = false;
   this.datenow = moment(new Date()).format("YYYY-MM-DD");

 }

 async listcancel(){
         this.InputPriority = "Low";
       this.datenow = moment(new Date()).format("YYYY-MM-DD");
       this.newTodo= '';
       this.todoedit = false;
       this.showList = true;

   this.showList = true;
 }

    // this.searchScreenName = 'Screen Name';
  //}
  //  activate() {
  //   this.user = JSON.parse(sessionStorage.getItem('user'));
  //}
async save() {
  var todo = {};
  let serverResponse;

if(this.todoedit) {
    todo = {
    _id: this.editid,
    todo: this.newTodo,
    todoAuthor: this.user._id,
    priority: this.InputPriority,
    dateDue: this.datenow
  }

        serverResponse = await this.todos.saveeditTodo(todo);

} else {
    todo = {
    todo: this.newTodo,
    todoAuthor: this.user._id,
    priority: this.InputPriority,
    dateDue: this.datenow
  }


      serverResponse = await this.todos.saveTodo(todo);
}
      if (serverResponse && !serverResponse.error) {
        this.newTodo = "";
        this.saveStatus = "";
     //   this.todos.todoArray[0] = null;
         } else {
        this.saveStatus = "Error saving todo";
      }


      this.InputPriority = "Low";
       this.datenow = moment(new Date()).format("YYYY-MM-DD");
       this.newtodo= '';
       this.todoedit = false;

      serverResponse = await this.todos.getUsersTodos(this.user._id);
      if (serverResponse.error) {
        this.wallMessage = "Error retrieving todos";
      }
      this.showList = true;

}

/*
  async todo() {
    if (this.newTodo) {
      var todo = {
        todo: this.newTodo,
        todoAuthor: this.user._id
      }
      let serverResponse = await this.todos.saveTodo(todo);
      if (serverResponse && !serverResponse.error) {
        this.newTodo = "";
        this.saveStatus = "";
        this.todos.todoArray[0].todoAuthor = new Object();
        //this.chirps.chirpArray[0].chirpAuthor.email = { email: this.user.email };
         this.todos.todoArray[0].todoAuthor.email = this.user.email;
         this.todos.todoArray[0].todoAuthor.screenName = this.user.screenName;
      } else {
        this.saveStatus = "Error saving todo";
      }
    }
  }
*/

//  async follow() {

//    let serverResponse = await this.users.getPersonScreenName(this.searchScreenName);
 //   this.notMe = true;
 //   if (serverResponse && !serverResponse.error) {
  //    let response = await this.users.followUser(this.user._id, serverResponse._id);
  //    if (response.error) {
   //     this.wallMessage = "Error following user";
  ///    }
   // }
  //}

//async follow(){
 //   await this.users.followUser(this.user._id, this.users.selectedUser._id);
  //}




  async activate() {
    
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.users.setUser(this.user);

    let serverResponse = await this.todos.getUsersTodos(this.user._id);
    if (serverResponse.error) {
      this.wallMessage = "Error retrieving todos";
   }
  }

  




  async findUser() {
    let serverResponse = await this.users.getPersonScreenName(this.searchScreenName);
    this.notMe = true;
    if (serverResponse && !serverResponse.error) {
      let response = await this.chirps.getUsersChirps(serverResponse._id);
      this.users.setUser(serverResponse);
      if (response.error) {
        this.wallMessage = "Error retrieving chirps";
      }
    }
  }

  async toggleComplete(index)
{
    this.todos.completed(this.todos.todoArray[index]._id);
    this.todos.todoArray[index].completed = !this.todos.todoArray[index].completed;
}

 toggleShowComplete() {

    this.showCompleted = !this.showCompleted;

 }


  async deleteTodo(index)
{
    this.todos.deletetodofunction(this.todos.todoArray[index]._id);

    delete this.todos.todoArray.splice(index, 1);
}

 // like(index) {
   // this.chirps.like(this.chirps.chirpArray[index]._id);
  //  this.chirps.chirpArray[index].likes++;
  //}

//  async reChirp(chirp) {
 //   var newChirp = {
  //    chirp: chirp.chirp,
      //user: chirp.user,
   //   user: this.user._id,

    //  reChirp: true,
    // chirpAuthor: chirp.user
    //  chirpAuthor: this.user._id
  //  };


 //   let serverResponse = await this.chirps.saveChirp(newChirp);
  //  if (serverResponse && !serverResponse.error) {
  //    this.saveStatus = "";
   //   this.chirps.chirpArray[0].chirpAuthor = new Object();
  //    this.chirps.chirpArray[0].chirpAuthor = { email: this.user.email };
     //      this.chirps.chirpArray[0].chirpAuthor.email = chirp.user.email;
    //     this.chirps.chirpArray[0].chirpAuthor.screenName = chirp.user.screenName;
 //   } else {
   //   this.saveStatus = "Error saving chirp";
  //  }
 // }




}
