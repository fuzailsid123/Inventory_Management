#include "storage.hpp"
#include <iostream>
#include <string>

using namespace std;

int main(int argc, char* argv[]) {
    if (argc != 3) {
        cerr << "Error: Expected 2 arguments (email, password)" << endl;
        return 1;
    }

    string email = argv[1];
    string password = argv[2];
    unsigned long passwordHash = basic_hash(password);

    vector<User> users = load_data<User>(USERS_DB);

    for (const auto& user : users) {
        if (string(user.email) == email) {
            if (user.passwordHash == passwordHash) {
                cout << "Login Success: " << user.email << endl;
                return 0;
            } else {
                cerr << "Error: Invalid password" << endl;
                return 1;
            }
        }
    }

    cerr << "Error: User not found" << endl;
    return 1;
}