#include "storage.hpp"
#include <iostream>
#include <string>
#include <cstring>

using namespace std;

int main(int argc, char* argv[]) {
    if (argc != 4) {
        cerr << "Error: Expected 3 arguments (email, password, name)" << endl;
        return 1;
    }

    string email = argv[1];
    string password = argv[2];
    string name = argv[3];

    vector<User> users = load_data<User>(USERS_DB);

    for (const auto& user : users) {
        if (string(user.email) == email) {
            cerr << "Error: Email already exists" << endl;
            return 1;
        }
    }

    User new_user;
    new_user.id = get_next_id(users);
    strncpy(new_user.email, email.c_str(), 99);
    strncpy(new_user.name, name.c_str(), 99);
    new_user.passwordHash = basic_hash(password);

    users.push_back(new_user);

    if (save_data(users, USERS_DB)) {
        cout << new_user.email << endl;
    } else {
        cerr << "Error: Could not save user data" << endl;
        return 1;
    }

    return 0;
}