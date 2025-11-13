#include "storage.hpp"
#include <iostream>
#include <string>

int main(int argc, char* argv[]) {
    if (argc != 3) {
        std::cerr << "Error: Expected 2 arguments (email, password)" << std::endl;
        return 1;
    }

    std::string email = argv[1];
    std::string password = argv[2];
    unsigned long passwordHash = basic_hash(password);

    std::vector<User> users = load_data<User>(USERS_DB);

    for (const auto& user : users) {
        if (std::string(user.email) == email) {
            if (user.passwordHash == passwordHash) {
                std::cout << "Login Success: " << user.email << std::endl;
                return 0;
            } else {
                std::cerr << "Error: Invalid password" << std::endl;
                return 1;
            }
        }
    }

    std::cerr << "Error: User not found" << std::endl;
    return 1;
}