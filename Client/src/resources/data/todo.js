
import { inject } from 'aurelia-framework';
import { DataServices } from './data-services';

@inject(DataServices)
export class Todos {

    constructor(data) {
        this.data = data;
        this.todosArray = undefined;
    }

    async saveTodo(todo) {
        try {
            let serverResponse = await this.data.post(todo, this.data.TODO_SERVICE);
            if (!serverResponse.error && !todo.reTodo) {
                this.todoArray.unshift(serverResponse);
            }
            return serverResponse;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

        async saveeditTodo(todo) {
        try {
            let serverResponse = await this.data.put(todo, this.data.TODO_SERVICE);
            if (!serverResponse.error && !todo.reTodo) {
                this.todoArray.unshift(serverResponse);
            }
            return serverResponse;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }



    async getUsersTodos(id) {
        //   var url = this.data.CHIRP_SERVICE + '/userTodos/' + id;
        var url = this.data.TODO_SERVICE + '/userTodos/' + id;
        try {
            let serverResponse = await this.data.get(url);
            if (!serverResponse.error) {
                this.todoArray = serverResponse;
            }
            return serverResponse;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    async completed(id) {
        var todo = {};
        try {
            let serverResponse = await this.data.put(todo, this.data.TODO_SERVICE + '/completed/' + id);
            return serverResponse;
        } catch (error) {
            console.log(error);
            return undefined;
        }

    }

    async deletetodofunction(id) {

        console.log("delete " + id);
        try {
            let serverResponse = await this.data.delete(this.data.TODO_SERVICE + '/' + id);
            return serverResponse;
        } catch (error) {
            console.log(error);
            return undefined;
        }

    }


    // async like(id){
    //    var todo = {};
    //    try {
    //  	let serverResponse = await this.data.put(todo, this.data.TODO_SERVICE + '/like/' + id);
    //	return serverResponse;
    //     } catch (error) {
    //        console.log(error);
    //        return undefined;
    //     }
    //   }



}