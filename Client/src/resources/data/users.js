//needs save a user, follow a user, and find a user using screen name

import { inject } from 'aurelia-framework';
import { DataServices } from './data-services';

@inject(DataServices)
export class Users {

    constructor(data) {
        this.data = data;
        this.UsersArray = undefined;
    }

    async getPersonScreenName(name) {
        if (name) {
            try {
                let serverResponse = await this.data.get(this.data.USER_SERVICE + "/screenName/" + name);
                return serverResponse;
            } catch (error) {
                console.log(error);
                return undefined;
            }
        }
    }



async save(user){
        if(user){
            try{
                let serverResponse = await this.data.post(user, this.data.USER_SERVICE);
                return serverResponse;
             } catch (error) {
                console.log(error);
                return undefined;
            }
        }
    }
setUser(user) {
        this.selectedUser = user;
        console.log("this.selectedUser._id is " + user._id);
    }





}