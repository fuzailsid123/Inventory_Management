#include "storage.hpp"
#include <iostream>
#include <string>
#include <cstring>

int main(int argc, char* argv[]) {
    if (argc != 4) {
        std::cerr << "Error: Expected 3 arguments (email, password, name)" << std::endl;
        return 1;
    }

    std::string email = argv[1];
    std::string password = argv[2];
    std::string name = argv[3];

    std::vector<User> users = load_data<User>(USERS_DB);

    for (const auto& user : users) {
        if (std::string(user.email) == email) {
            std::cerr << "Error: Email already exists" << std::endl;
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
        std::cout << new_user.email << std::endl;
    } else {
        std::cerr << "Error: Could not save user data" << std::endl;
        return 1;
    }

    return 0;
}