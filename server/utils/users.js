//remove user from user list
// add users
//get userList

class User{
    
    constructor() {
        this.users = [];
    }

    addUser(id, name, room){
        let user = {id,name,room}
        this.users.push(user);
        console.log(this.users);
        return user;
    }

    getUser(id) {
        var user = this.users.filter((user) => { 
            return user.id === id;
        });
        return user[0];
    }

    removeUser(id) {
        var removedUser =[] ;
        this.users = this.users.filter(function (user) {
            if(user.id != id) {
                return user; 
            } else {
                removedUser = user;
            }
        })
        return removedUser;
    }

    getUserList(room) {

        var users = this.users.filter((user)=> user.room === room);
        var namesArray = users.map((user)=>user.name);
        return namesArray;
    }

}

module.exports = {User}